import { z } from 'zod';

export const genderSchema = z.enum(['woman', 'man', 'non_binary', 'other']);
export const communitySlugSchema = z.enum(['women', 'men']);
export const chartRangeSchema = z.enum(['1m', '2m', 'all']);

export const onboardingSchema = z
  .object({
    full_name: z.string().min(1).max(120),
    height_in: z.number().min(36).max(96),
    current_weight_lb: z.number().min(50).max(800),
    goal_weight_lb: z.number().min(50).max(800).nullable().optional(),
    gender: genderSchema,
    other_gender_text: z.string().max(80).nullable().optional(),
    community_slug: communitySlugSchema.optional(),
    photo_url: z.string().url().nullable().optional(),
    photo_public_id: z.string().nullable().optional(),
  })
  .superRefine((data, ctx) => {
    if (data.gender === 'woman' || data.gender === 'man') {
      return;
    }
    if (!data.community_slug) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'Pick a community (Women or Men)',
        path: ['community_slug'],
      });
    }
    if (data.gender === 'other' && !data.other_gender_text?.trim()) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'Please describe your gender',
        path: ['other_gender_text'],
      });
    }
  });

export const unitsSchema = z.enum(['lb_in', 'kg_cm']);

export const updateProfileSchema = z.object({
  full_name: z.string().min(1).max(120).optional(),
  height_in: z.number().min(36).max(96).optional(),
  start_weight_lb: z.number().min(50).max(800).optional(),
  goal_weight_lb: z.number().min(50).max(800).nullable().optional(),
  photo_url: z.string().url().nullable().optional(),
  photo_public_id: z.string().nullable().optional(),
  units: unitsSchema.optional(),
});

export const createRegimenSchema = z.object({
  medication_name: z.string().min(1).max(120),
  amount_mg: z.number().positive().max(100),
  start_date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
});

export const changeRegimenSchema = z.object({
  /** Which active regimen to replace. Omitted by older app builds. */
  regimen_id: z.string().uuid().optional(),
  medication_name: z.string().min(1).max(120),
  amount_mg: z.number().positive().max(100),
  start_date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
});

export const stopRegimenSchema = z.object({
  end_date: z
    .string()
    .regex(/^\d{4}-\d{2}-\d{2}$/)
    .optional(),
});

export const createDoseLogSchema = z.object({
  logged_on: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  amount_mg: z.number().positive().max(100),
  /** Which active regimen this shot belongs to. */
  regimen_id: z.string().uuid().optional(),
});

export const createWeightLogSchema = z.object({
  logged_on: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  weight_lb: z.number().min(50).max(800),
});

export const createMeasurementTypeSchema = z.object({
  label: z.string().min(1).max(60),
});

export const createMeasurementLogSchema = z.object({
  type_id: z.string().uuid(),
  value_in: z.number().positive().max(200),
  logged_on: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
});

export const pushTokenSchema = z.object({
  token: z.string().min(10),
  platform: z.enum(['ios', 'android', 'web']).optional(),
});

export const notificationPrefsSchema = z.object({
  community: z.boolean().optional(),
  announcements: z.boolean().optional(),
  shot_reminders: z.boolean().optional(),
});

export const cloudinarySignSchema = z.object({
  folder: z
    .enum(['myera/profiles', 'myera/progress', 'myera/posts'])
    .default('myera/profiles'),
});

export const dateStringSchema = z.string().regex(/^\d{4}-\d{2}-\d{2}$/);

export const createProgressPhotoSchema = z.object({
  taken_on: dateStringSchema,
  url: z.string().url(),
  public_id: z.string().nullable().optional(),
});

export const updateProgressPhotoSchema = z.object({
  url: z.string().url(),
  public_id: z.string().nullable().optional(),
});

export const mealTypeSchema = z.enum(['breakfast', 'lunch', 'dinner', 'snack']);

export const createFoodLogSchema = z.object({
  logged_on: dateStringSchema,
  meal_type: mealTypeSchema,
  food_name: z.string().min(1).max(200),
  off_code: z.string().max(64).nullable().optional(),
  servings: z.number().positive().max(100),
  serving_label: z.string().min(1).max(80).default('serving'),
  calories: z.number().min(0).max(10000),
  protein_g: z.number().min(0).max(1000),
  carbs_g: z.number().min(0).max(1000),
  fat_g: z.number().min(0).max(1000),
});

export const updateFoodLogSchema = z.object({
  servings: z.number().positive().max(100).optional(),
  meal_type: mealTypeSchema.optional(),
  calories: z.number().min(0).max(10000).optional(),
  protein_g: z.number().min(0).max(1000).optional(),
  carbs_g: z.number().min(0).max(1000).optional(),
  fat_g: z.number().min(0).max(1000).optional(),
});

export const calorieGoalSchema = z.object({
  calorie_goal_kcal: z.number().int().min(800).max(6000),
});

export const reportReasonSchema = z.enum([
  'spam',
  'harassment',
  'unsafe_medical',
  'inappropriate_photo',
  'other',
]);

export const createPostSchema = z.object({
  body: z.string().min(1).max(2000),
  photo_urls: z.array(z.string().url()).max(3).default([]),
  include_weight_change: z.boolean().default(false),
  include_before_after: z.boolean().default(false),
  include_dose: z.boolean().default(false),
  before_url: z.string().url().nullable().optional(),
  after_url: z.string().url().nullable().optional(),
});

export const createCommentSchema = z.object({
  body: z.string().min(1).max(1000),
});

export const reportPostSchema = z.object({
  reason: reportReasonSchema,
  hide_author: z.boolean().optional().default(false),
});

export const hideMemberSchema = z.object({
  hidden_user_id: z.string().uuid(),
});

export const shotFrequencySchema = z.enum(['weekly', 'every_2_weeks', 'daily']);

export const upsertShotScheduleSchema = z.object({
  frequency: shotFrequencySchema,
  shot_day: z.number().int().min(0).max(6).nullable().optional(),
  shot_time: z.string().regex(/^\d{2}:\d{2}(:\d{2})?$/),
  day_before_enabled: z.boolean().default(false),
  day_before_time: z
    .string()
    .regex(/^\d{2}:\d{2}(:\d{2})?$/)
    .nullable()
    .optional(),
  second_reminder_enabled: z.boolean().default(false),
  hide_on_lockscreen: z.boolean().default(false),
  timezone: z.string().min(1).max(64).default('UTC'),
  enabled: z.boolean().default(true),
});

export const snoozeShotSchema = z.object({
  hours: z.number().positive().max(24).default(1),
});

export const announcementAudienceSchema = z.enum(['all', 'women', 'men']);

export const createAnnouncementSchema = z.object({
  title: z.string().min(1).max(160),
  body: z.string().min(1).max(4000),
  audience: announcementAudienceSchema.default('all'),
  send_push: z.boolean().default(true),
  pin_to_feed: z.boolean().default(false),
  publish_at: z.string().datetime().nullable().optional(),
  publish_now: z.boolean().optional().default(true),
});

export const adminReportActionSchema = z.object({
  action: z.enum(['remove', 'keep']),
});

export const adminSuspendSchema = z.object({
  suspend: z.boolean(),
});

export const adminCommunityDecisionSchema = z.object({
  decision: z.enum(['approved', 'rejected']),
});

export const adminMoveMemberSchema = z.object({
  community_slug: communitySlugSchema,
});

export type OnboardingInput = z.infer<typeof onboardingSchema>;
export type UpdateProfileInput = z.infer<typeof updateProfileSchema>;
export type CreateProgressPhotoInput = z.infer<typeof createProgressPhotoSchema>;
export type CreateFoodLogInput = z.infer<typeof createFoodLogSchema>;
export type CreatePostInput = z.infer<typeof createPostSchema>;
export type UpsertShotScheduleInput = z.infer<typeof upsertShotScheduleSchema>;
export type CreateAnnouncementInput = z.infer<typeof createAnnouncementSchema>;

/** Weekdays: 0 = Sunday … 6 = Saturday. Optional time is "HH:MM". */
export const injectionScheduleSchema = z.object({
  product_name: z.string().trim().min(1).max(120),
  weekdays: z.array(z.number().int().min(0).max(6)).min(1).max(7),
  time_of_day: z
    .string()
    .regex(/^([01]\d|2[0-3]):[0-5]\d$/)
    .nullable()
    .optional(),
  enabled: z.boolean().default(true),
});
