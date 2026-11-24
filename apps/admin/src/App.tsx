import React, { useCallback, useEffect, useState } from 'react';
import { Session } from '@supabase/supabase-js';
import { adminRequest } from './lib/api';
import { supabase, supabaseConfigured } from './lib/supabase';

type Tab = 'reports' | 'announcements' | 'members' | 'posts' | 'changes';

export function App() {
  const [session, setSession] = useState<Session | null>(null);
  const [booting, setBooting] = useState(true);

  useEffect(() => {
    if (!supabaseConfigured) {
      setBooting(false);
      return;
    }
    supabase.auth.getSession().then(({ data }) => {
      setSession(data.session);
      setBooting(false);
    });
    const { data: sub } = supabase.auth.onAuthStateChange((_e, s) => setSession(s));
    return () => sub.subscription.unsubscribe();
  }, []);

  if (booting) {
    return (
      <div className="login">
        <p className="muted">Loading…</p>
      </div>
    );
  }

  if (!session) return <LoginForm />;

  return <AdminShell session={session} />;
}

function LoginForm() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const { error: err } = await supabase.auth.signInWithPassword({ email, password });
      if (err) throw err;
    } catch (err: any) {
      setError(err.message || String(err));
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="login">
      <form className="login-card" onSubmit={onSubmit}>
        <h1>My Era Admin</h1>
        <p className="muted" style={{ marginBottom: 20 }}>
          Sign in with an admin account. Members without role=admin are blocked.
        </p>
        {!supabaseConfigured && (
          <p className="error">Set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY.</p>
        )}
        {error && <p className="error">{error}</p>}
        <div className="field">
          <label>Email</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            autoComplete="username"
          />
        </div>
        <div className="field">
          <label>Password</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            autoComplete="current-password"
          />
        </div>
        <button className="btn" type="submit" disabled={loading || !supabaseConfigured}>
          {loading ? 'Signing in…' : 'Sign in'}
        </button>
      </form>
    </div>
  );
}

function AdminShell({ session }: { session: Session }) {
  const [tab, setTab] = useState<Tab>('reports');
  const token = session.access_token;

  return (
    <div className="shell">
      <aside className="sidebar">
        <h1>My Era</h1>
        <p>Admin panel</p>
        <nav className="nav">
          {(
            [
              ['reports', 'Reported posts'],
              ['announcements', 'Announcements'],
              ['members', 'Members'],
              ['posts', 'All posts'],
              ['changes', 'Community changes'],
            ] as [Tab, string][]
          ).map(([key, label]) => (
            <button
              key={key}
              type="button"
              className={tab === key ? 'active' : ''}
              onClick={() => setTab(key)}
            >
              {label}
            </button>
          ))}
        </nav>
        <button className="signout" type="button" onClick={() => supabase.auth.signOut()}>
          Sign out
        </button>
      </aside>
      <main className="main">
        {tab === 'reports' && <ReportsPanel token={token} />}
        {tab === 'announcements' && <AnnouncementsPanel token={token} />}
        {tab === 'members' && <MembersPanel token={token} />}
        {tab === 'posts' && <PostsPanel token={token} />}
        {tab === 'changes' && <ChangesPanel token={token} />}
      </main>
    </div>
  );
}

function ReportsPanel({ token }: { token: string }) {
  const [reports, setReports] = useState<any[]>([]);
  const [error, setError] = useState('');
  const [busy, setBusy] = useState<string | null>(null);

  const load = useCallback(async () => {
    try {
      setError('');
      const r = await adminRequest<{ reports: any[] }>('/admin/reports', token);
      setReports(r.reports || []);
    } catch (e: any) {
      setError(e.message || String(e));
    }
  }, [token]);

  useEffect(() => {
    load();
  }, [load]);

  async function act(reportId: string, action: 'remove' | 'keep') {
    try {
      setBusy(reportId + action);
      await adminRequest(`/admin/reports/${reportId}/action`, token, {
        method: 'POST',
        body: JSON.stringify({ action }),
      });
      await load();
    } catch (e: any) {
      setError(e.message || String(e));
    } finally {
      setBusy(null);
    }
  }

  return (
    <>
      <h2>Reported posts</h2>
      <p className="lead">Review open reports. Remove hides the post from the community feed.</p>
      {error && <p className="error">{error}</p>}
      {reports.length === 0 ? (
        <div className="card">
          <p className="muted">No open reports.</p>
        </div>
      ) : (
        reports.map((r) => {
          const post = r.community_posts;
          return (
            <div className="card" key={r.id}>
              <div className="row" style={{ justifyContent: 'space-between' }}>
                <h3>Report · {r.report_count || 1}×</h3>
                <span className="badge">{post?.communities?.name || 'Community'}</span>
              </div>
              <p className="muted" style={{ marginBottom: 10 }}>
                Reasons: {(r.reasons || [r.reason]).join(', ')}
              </p>
              <p style={{ whiteSpace: 'pre-wrap', marginBottom: 14 }}>{post?.body || '—'}</p>
              <div className="row">
                <button
                  className="btn danger"
                  type="button"
                  disabled={!!busy}
                  onClick={() => act(r.id, 'remove')}
                >
                  Remove post
                </button>
                <button
                  className="btn ghost"
                  type="button"
                  disabled={!!busy}
                  onClick={() => act(r.id, 'keep')}
                >
                  Keep
                </button>
              </div>
            </div>
          );
        })
      )}
    </>
  );
}

function AnnouncementsPanel({ token }: { token: string }) {
  const [list, setList] = useState<any[]>([]);
  const [error, setError] = useState('');
  const [title, setTitle] = useState('');
  const [body, setBody] = useState('');
  const [audience, setAudience] = useState<'all' | 'women' | 'men'>('all');
  const [sendPush, setSendPush] = useState(true);
  const [pin, setPin] = useState(false);
  const [publishAt, setPublishAt] = useState('');
  const [saving, setSaving] = useState(false);

  const load = useCallback(async () => {
    try {
      setError('');
      const r = await adminRequest<{ announcements: any[] }>('/admin/announcements', token);
      setList(r.announcements || []);
    } catch (e: any) {
      setError(e.message || String(e));
    }
  }, [token]);

  useEffect(() => {
    load();
  }, [load]);

  async function create(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setError('');
    try {
      const publish_now = !publishAt;
      await adminRequest('/admin/announcements', token, {
        method: 'POST',
        body: JSON.stringify({
          title,
          body,
          audience,
          send_push: sendPush,
          pin_to_feed: pin,
          publish_now,
          publish_at: publishAt ? new Date(publishAt).toISOString() : null,
        }),
      });
      setTitle('');
      setBody('');
      setPublishAt('');
      setPin(false);
      await load();
    } catch (err: any) {
      setError(err.message || String(err));
    } finally {
      setSaving(false);
    }
  }

  return (
    <>
      <h2>Announcements</h2>
      <p className="lead">
        Compose for All / Women / Men. Push copy never includes private tracking data.
      </p>
      {error && <p className="error">{error}</p>}

      <form className="card form-grid" onSubmit={create}>
        <h3>New announcement</h3>
        <div className="field">
          <label>Title</label>
          <input value={title} onChange={(e) => setTitle(e.target.value)} required maxLength={160} />
        </div>
        <div className="field">
          <label>Body</label>
          <textarea value={body} onChange={(e) => setBody(e.target.value)} required maxLength={4000} />
        </div>
        <div className="field">
          <label>Audience</label>
          <select
            value={audience}
            onChange={(e) => setAudience(e.target.value as 'all' | 'women' | 'men')}
          >
            <option value="all">All members</option>
            <option value="women">Women only</option>
            <option value="men">Men only</option>
          </select>
        </div>
        <label className="check">
          <input type="checkbox" checked={sendPush} onChange={(e) => setSendPush(e.target.checked)} />
          Send push notification
        </label>
        <label className="check">
          <input type="checkbox" checked={pin} onChange={(e) => setPin(e.target.checked)} />
          Pin to community feed
        </label>
        <div className="field">
          <label>Schedule (optional — leave blank to publish now)</label>
          <input
            type="datetime-local"
            value={publishAt}
            onChange={(e) => setPublishAt(e.target.value)}
          />
        </div>
        <button className="btn" type="submit" disabled={saving}>
          {saving ? 'Saving…' : publishAt ? 'Schedule' : 'Publish now'}
        </button>
      </form>

      <h3 style={{ fontFamily: 'Lora, Georgia, serif', marginTop: 8 }}>History</h3>
      {list.map((a) => (
        <div className="card" key={a.id}>
          <div className="row" style={{ justifyContent: 'space-between' }}>
            <h3>{a.title}</h3>
            <span className="badge">{a.audience}</span>
          </div>
          <p className="muted" style={{ whiteSpace: 'pre-wrap' }}>
            {a.body}
          </p>
          <p className="muted" style={{ marginTop: 10 }}>
            {a.published_at
              ? `Published ${new Date(a.published_at).toLocaleString()}`
              : a.publish_at
                ? `Scheduled ${new Date(a.publish_at).toLocaleString()}`
                : 'Draft'}
            {' · '}
            Push sent: {a.push_sent_count ?? 0}
            {a.pin_to_feed ? ' · Pinned' : ''}
          </p>
          {!a.published_at && (
            <button
              className="btn ghost"
              type="button"
              style={{ marginTop: 10 }}
              onClick={async () => {
                try {
                  await adminRequest(`/admin/announcements/${a.id}/publish`, token, {
                    method: 'POST',
                    body: '{}',
                  });
                  await load();
                } catch (err: any) {
                  setError(err.message || String(err));
                }
              }}
            >
              Publish now
            </button>
          )}
        </div>
      ))}
    </>
  );
}

function MembersPanel({ token }: { token: string }) {
  const [members, setMembers] = useState<any[]>([]);
  const [error, setError] = useState('');

  const load = useCallback(async () => {
    try {
      setError('');
      const r = await adminRequest<{ members: any[] }>('/admin/members', token);
      setMembers(r.members || []);
    } catch (e: any) {
      setError(e.message || String(e));
    }
  }, [token]);

  useEffect(() => {
    load();
  }, [load]);

  async function suspend(id: string, suspend: boolean) {
    try {
      await adminRequest(`/admin/members/${id}/suspend`, token, {
        method: 'POST',
        body: JSON.stringify({ suspend }),
      });
      await load();
    } catch (e: any) {
      setError(e.message || String(e));
    }
  }

  async function move(id: string, community_slug: 'women' | 'men') {
    try {
      await adminRequest(`/admin/members/${id}/move`, token, {
        method: 'POST',
        body: JSON.stringify({ community_slug }),
      });
      await load();
    } catch (e: any) {
      setError(e.message || String(e));
    }
  }

  return (
    <>
      <h2>Members</h2>
      <p className="lead">Suspend access or move community. Private tracking data is not shown.</p>
      {error && <p className="error">{error}</p>}
      <div className="card" style={{ overflowX: 'auto' }}>
        <table className="table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>Community</th>
              <th>Role</th>
              <th>Status</th>
              <th />
            </tr>
          </thead>
          <tbody>
            {members.map((m) => (
              <tr key={m.id}>
                <td>{m.full_name || '—'}</td>
                <td>{m.email}</td>
                <td>{m.communities?.name || '—'}</td>
                <td>{m.role}</td>
                <td>{m.suspended_at ? 'Suspended' : 'Active'}</td>
                <td>
                  <div className="row">
                    <button
                      className="btn ghost"
                      type="button"
                      onClick={() => suspend(m.id, !m.suspended_at)}
                    >
                      {m.suspended_at ? 'Unsuspend' : 'Suspend'}
                    </button>
                    {m.communities?.slug !== 'women' && (
                      <button
                        className="btn ghost"
                        type="button"
                        onClick={() => move(m.id, 'women')}
                      >
                        → Women
                      </button>
                    )}
                    {m.communities?.slug !== 'men' && (
                      <button className="btn ghost" type="button" onClick={() => move(m.id, 'men')}>
                        → Men
                      </button>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}

function PostsPanel({ token }: { token: string }) {
  const [community, setCommunity] = useState<'all' | 'women' | 'men'>('all');
  const [posts, setPosts] = useState<any[]>([]);
  const [error, setError] = useState('');

  const load = useCallback(async () => {
    try {
      setError('');
      const q = community === 'all' ? '' : `?community=${community}`;
      const r = await adminRequest<{ posts: any[] }>(`/admin/posts${q}`, token);
      setPosts(r.posts || []);
    } catch (e: any) {
      setError(e.message || String(e));
    }
  }, [token, community]);

  useEffect(() => {
    load();
  }, [load]);

  return (
    <>
      <h2>All posts</h2>
      <p className="lead">Filter by community. Removed posts stay listed for audit.</p>
      <div className="seg">
        {(['all', 'women', 'men'] as const).map((c) => (
          <button
            key={c}
            type="button"
            className={community === c ? 'on' : ''}
            onClick={() => setCommunity(c)}
          >
            {c === 'all' ? 'All' : c === 'women' ? 'Women' : 'Men'}
          </button>
        ))}
      </div>
      {error && <p className="error">{error}</p>}
      {posts.map((p) => (
        <div className="card" key={p.id}>
          <div className="row" style={{ justifyContent: 'space-between' }}>
            <span className="badge">{p.communities?.name || '—'}</span>
            {p.removed_at && <span className="badge">Removed</span>}
          </div>
          <p style={{ whiteSpace: 'pre-wrap', marginTop: 10 }}>{p.body}</p>
          <p className="muted" style={{ marginTop: 8 }}>
            {new Date(p.created_at).toLocaleString()}
          </p>
        </div>
      ))}
    </>
  );
}

function ChangesPanel({ token }: { token: string }) {
  const [requests, setRequests] = useState<any[]>([]);
  const [error, setError] = useState('');

  const load = useCallback(async () => {
    try {
      setError('');
      const r = await adminRequest<{ requests: any[] }>('/admin/community-changes', token);
      setRequests(r.requests || []);
    } catch (e: any) {
      setError(e.message || String(e));
    }
  }, [token]);

  useEffect(() => {
    load();
  }, [load]);

  async function decide(id: string, decision: 'approved' | 'rejected') {
    try {
      await adminRequest(`/admin/community-changes/${id}`, token, {
        method: 'POST',
        body: JSON.stringify({ decision }),
      });
      await load();
    } catch (e: any) {
      setError(e.message || String(e));
    }
  }

  return (
    <>
      <h2>Community changes</h2>
      <p className="lead">Approve or reject pending community move requests.</p>
      {error && <p className="error">{error}</p>}
      {requests.length === 0 ? (
        <div className="card">
          <p className="muted">No pending requests.</p>
        </div>
      ) : (
        requests.map((r) => (
          <div className="card" key={r.id}>
            <h3>{r.profile?.full_name || r.profile?.email || r.user_id}</h3>
            <p className="muted">
              {r.from_community?.name || '—'} → {r.to_community?.name || '—'}
            </p>
            <div className="row" style={{ marginTop: 12 }}>
              <button className="btn" type="button" onClick={() => decide(r.id, 'approved')}>
                Approve
              </button>
              <button className="btn ghost" type="button" onClick={() => decide(r.id, 'rejected')}>
                Reject
              </button>
            </div>
          </div>
        ))
      )}
    </>
  );
}
