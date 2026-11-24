export type Gender = 'woman' | 'man' | 'non_binary' | 'other';
export type CommunitySlug = 'women' | 'men';
export type Units = 'lb_in' | 'kg_cm';
export type ChartRange = '1m' | '2m' | 'all';
export type ShotFrequency = 'weekly' | 'every_2_weeks' | 'daily';
export type MealType = 'breakfast' | 'lunch' | 'dinner' | 'snack';
export type ReportReason =
  | 'spam'
  | 'harassment'
  | 'unsafe_medical'
  | 'inappropriate_photo'
  | 'other';

export interface Community {
  id: string;
  slug: CommunitySlug;
  name: string;
}

export type ProfileRole = 'member' | 'admin';
export type AnnouncementAudience = 'all' | 'women' | 'men';
export type ReportStatus = 'open' | 'removed' | 'kept';

export interface Profile {
  id: string;
  full_name: string | null;
  email: string;
  photo_url: string | null;
  photo_public_id: string | null;
  height_in: number | null;
  start_weight_lb: number | null;
  current_weight_lb: number | null;
  goal_weight_lb: number | null;
  gender: Gender | null;
  other_gender_text: string | null;
  community_id: string | null;
  units: Units;
  calorie_goal_kcal: number | null;
  role?: ProfileRole;
  suspended_at?: string | null;
  deleted_at?: string | null;
  onboarding_completed_at: string | null;
  created_at: string;
  updated_at: string;
  community?: Community | null;
}

export interface ShotSchedule {
  user_id: string;
  frequency: ShotFrequency;
  shot_day: number | null;
  shot_time: string;
  day_before_enabled: boolean;
  day_before_time: string | null;
  second_reminder_enabled: boolean;
  hide_on_lockscreen: boolean;
  timezone: string;
  enabled: boolean;
  next_fire_at: string | null;
  last_fired_at: string | null;
  last_dose_logged_on: string | null;
  snooze_until: string | null;
  updated_at: string;
}

export interface Announcement {
  id: string;
  title: string;
  body: string;
  audience: AnnouncementAudience;
  send_push: boolean;
  pin_to_feed: boolean;
  publish_at: string | null;
  published_at: string | null;
  created_by: string | null;
  push_sent_count: number;
  created_at: string;
  read?: boolean;
}

export interface ProgressPhoto {
  id: string;
  user_id: string;
  taken_on: string;
  url: string;
  public_id: string | null;
  created_at: string;
}

export interface FoodLog {
  id: string;
  user_id: string;
  logged_on: string;
  meal_type: MealType;
  food_name: string;
  off_code: string | null;
  servings: number;
  serving_label: string;
  calories: number;
  protein_g: number;
  carbs_g: number;
  fat_g: number;
  created_at: string;
}

export interface FoodSearchResult {
  code: string;
  name: string;
  brand: string | null;
  serving_label: string;
  calories_per_serving: number;
  protein_g_per_serving: number;
  carbs_g_per_serving: number;
  fat_g_per_serving: number;
  image_url: string | null;
}

export interface FoodDaySummary {
  logged_on: string;
  calorie_goal_kcal: number;
  calories_eaten: number;
  calories_left: number;
  protein_g: number;
  carbs_g: number;
  fat_g: number;
  logs: FoodLog[];
}

export interface CommunityPost {
  id: string;
  community_id: string;
  author_id: string;
  body: string;
  photo_urls: string[];
  include_weight_change: boolean;
  include_before_after: boolean;
  include_dose: boolean;
  weight_change_lb: number | null;
  before_url: string | null;
  after_url: string | null;
  dose_label: string | null;
  created_at: string;
  author_name?: string | null;
  author_photo_url?: string | null;
  like_count?: number;
  comment_count?: number;
  liked_by_me?: boolean;
}

export interface PostComment {
  id: string;
  post_id: string;
  author_id: string;
  body: string;
  created_at: string;
  author_name?: string | null;
  author_photo_url?: string | null;
}

export interface DoseRegimen {
  id: string;
  user_id: string;
  medication_name: string;
  amount_mg: number;
  start_date: string;
  end_date: string | null;
  created_at: string;
}

export interface DoseLog {
  id: string;
  user_id: string;
  logged_on: string;
  amount_mg: number;
  regimen_id: string | null;
  created_at: string;
}

export interface WeightLog {
  id: string;
  user_id: string;
  logged_on: string;
  weight_lb: number;
  created_at: string;
}

export interface MeasurementType {
  id: string;
  user_id: string | null;
  key: string;
  label: string;
  is_system: boolean;
}

export interface MeasurementLog {
  id: string;
  user_id: string;
  type_id: string;
  value_in: number;
  logged_on: string;
  created_at: string;
  type?: MeasurementType;
}

export interface MeasurementSummary {
  type: MeasurementType;
  latest_value_in: number | null;
  latest_logged_on: string | null;
  first_value_in: number | null;
  change_in: number | null;
}

export interface WeightChartPoint {
  logged_on: string;
  weight_lb: number;
}

export interface DoseChangeMarker {
  date: string;
  amount_mg: number;
  medication_name: string;
}

export interface WeightChartResponse {
  points: WeightChartPoint[];
  dose_changes: DoseChangeMarker[];
  latest_weight_lb: number | null;
  delta_lb: number | null;
  range: ChartRange;
}

export interface NotificationPrefs {
  user_id: string;
  community: boolean;
  announcements: boolean;
  shot_reminders: boolean;
}

export interface TodaySummary {
  profile: Profile;
  week_number: number | null;
  lb_lost: number | null;
  to_go_lb: number | null;
  /** First of active_doses; kept for older app builds. */
  active_dose: DoseRegimen | null;
  active_doses: DoseRegimen[];
  next_shot_label: string | null;
  calorie_goal_kcal: number;
  calories_eaten: number;
  protein_g: number;
  carbs_g: number;
  fat_g: number;
}
