/**
 * Work around DB unique index `dose_regimens_one_active` (one null end_date per user).
 * Extra active meds use this open-end sentinel so the partial unique index does not apply.
 * Legacy rows with end_date = null are still treated as active.
 */
export const DOSE_OPEN_END = '9999-12-31';

/** Supabase `.or(...)` filter matching active regimens. */
export const ACTIVE_DOSE_OR_FILTER = 'end_date.is.null,end_date.gte.9000-01-01';

export function isActiveDoseEndDate(end_date: string | null | undefined): boolean {
  if (end_date == null || end_date === '') return true;
  return end_date >= '9000-01-01';
}
