import {
  boolean,
  integer,
  pgTable,
  serial,
  text,
  timestamp,
  uuid,
  jsonb,
  pgEnum,
} from "drizzle-orm/pg-core";

// ============================================
// ENUMS
// ============================================

export const planEnum = pgEnum("plan", ["free", "starter", "pro", "scale"]);
export const subscriptionStatusEnum = pgEnum("subscription_status", [
  "active",
  "past_due",
  "cancelled",
  "trialing",
]);
export const videoStyleEnum = pgEnum("video_style", [
  "ugc",
  "trend",
  "cinematic_luxury",
  "product_showcase",
  "stop_motion",
  "before_after",
  "educational",
  "lifestyle",
  "unboxing",
  "asmr",
  "cyber_glitch",
  "surreal_abstract",
]);
export const platformEnum = pgEnum("platform", [
  "tiktok",
  "instagram",
  "facebook",
  "youtube_shorts",
  "linkedin",
  "twitter",
]);
export const postStatusEnum = pgEnum("post_status", [
  "draft",
  "scheduled",
  "posted",
  "failed",
]);
export const projectStatusEnum = pgEnum("project_status", [
  "processing",
  "ready",
  "failed",
]);
export const toneEnum = pgEnum("tone_of_voice", [
  "casual",
  "professional",
  "playful",
  "luxury",
  "urgent",
]);

// ✅ NEW: Waitlist Status Enum
export const waitlistStatusEnum = pgEnum("waitlist_status", [
  "pending", // Czeka na dostęp
  "accepted", // Dostał dostęp do platformy
  "rewarded", // Już dostał bonus credits
]);

// ============================================
// USERS & SUBSCRIPTIONS
// ============================================

export const usersTable = pgTable("users", {
  id: uuid("id").primaryKey().defaultRandom(),
  email: text("email").notNull().unique(),
  display_name: text("display_name"), // ADD THIS - user's display name
  avatar_url: text("avatar_url"), // ADD THIS - URL to avatar image
  plan: planEnum("plan").notNull().default("free"),
  credits: integer("credits").notNull().default(50),
  created_at: timestamp("created_at").notNull().defaultNow(),
  updated_at: timestamp("updated_at").notNull().defaultNow(),
  is_active: boolean("is_active").notNull().default(true),
  deleted_at: timestamp("deleted_at"), // Already added
});
export const reviewsTable = pgTable("reviews", {
  id: uuid("id").primaryKey().defaultRandom(),
  user_id: uuid("user_id")
    .notNull()
    .references(() => usersTable.id, { onDelete: "cascade" }),
  user_email: text("user_email").notNull(),
  user_name: text("user_name"), // Display name at time of review
  user_avatar: text("user_avatar"), // Avatar URL at time of review
  rating: integer("rating").notNull(), // 1-5 stars
  title: text("title").notNull(),
  content: text("content").notNull(),
  is_verified: boolean("is_verified").notNull().default(false), // Admin can verify
  is_published: boolean("is_published").notNull().default(true),
  created_at: timestamp("created_at").notNull().defaultNow(),
  updated_at: timestamp("updated_at").notNull().defaultNow(),
});

// Optional: Table for admin responses to reviews
export const reviewResponsesTable = pgTable("review_responses", {
  id: uuid("id").primaryKey().defaultRandom(),
  review_id: uuid("review_id")
    .notNull()
    .references(() => reviewsTable.id, { onDelete: "cascade" }),
  response: text("response").notNull(),
  created_at: timestamp("created_at").notNull().defaultNow(),
});

export const subscriptionsTable = pgTable("subscriptions", {
  id: uuid("id").primaryKey().defaultRandom(),
  user_id: uuid("user_id")
    .notNull()
    .references(() => usersTable.id, { onDelete: "cascade" })
    .unique(),
  stripe_subscription_id: text("stripe_subscription_id").unique(),
  stripe_customer_id: text("stripe_customer_id"),
  stripe_price_id: text("stripe_price_id"),
  status: subscriptionStatusEnum("status").notNull(),
  current_period_end: timestamp("current_period_end"),
  created_at: timestamp("created_at").notNull().defaultNow(),
  updated_at: timestamp("updated_at").notNull().defaultNow(),
});

// ============================================
// ✅ WAITLIST TABLE
// ============================================

export const waitlistTable = pgTable("waitlist", {
  id: uuid("id").primaryKey().defaultRandom(),
  email: text("email").notNull().unique(),
  user_id: uuid("user_id").references(() => usersTable.id, {
    onDelete: "set null",
  }),
  created_at: timestamp("created_at").notNull().defaultNow(),
});

// ============================================
// CAMPAIGNS
// ============================================

export const campaignsTable = pgTable("campaigns", {
  id: uuid("id").primaryKey().defaultRandom(),
  user_id: uuid("user_id")
    .notNull()
    .references(() => usersTable.id, { onDelete: "cascade" }),
  name: text("name"),
  description: text("description"),
  product_image_url: text("product_image_url").notNull(),
  videos_generated: integer("videos_generated").notNull().default(0),
  total_views: integer("total_views").default(0),
  total_likes: integer("total_likes").default(0),
  total_shares: integer("total_shares").default(0),
  created_at: timestamp("created_at").notNull().defaultNow(),
  updated_at: timestamp("updated_at").notNull().defaultNow(),
});

// ============================================
// PROJECTS & PRODUCTS
// ============================================

export const projectsTable = pgTable("projects", {
  id: uuid("id").primaryKey().defaultRandom(),
  user_id: uuid("user_id")
    .notNull()
    .references(() => usersTable.id, { onDelete: "cascade" }),
  campaign_id: uuid("campaign_id").references(() => campaignsTable.id, {
    onDelete: "cascade",
  }),
  name: text("name"),
  description: text("description"),
  product_image_url: text("product_image_url").notNull(),
  selected_styles: videoStyleEnum("selected_styles").array().notNull(),
  language: text("language").notNull().default("en"),
  status: projectStatusEnum("status").notNull().default("processing"),
  quality: text("quality").notNull(),
  duration: integer("duration"),

  // Audio/Visual Settings
  // subtitles_enabled: boolean("subtitles_enabled").notNull().default(false),
  // subtitle_style: text("subtitle_style"),
  // color_scheme: text("color_scheme"),
  // music_enabled: boolean("music_enabled").notNull().default(true),

  // Creative Control Fields
  tone_of_voice: toneEnum("tone_of_voice").default("casual"),
  custom_hook: text("custom_hook"),
  key_message: text("key_message"),
  call_to_action: text("call_to_action"),
  target_audience: text("target_audience"),
  key_selling_points: text("key_selling_points"),

  created_at: timestamp("created_at").notNull().defaultNow(),
  updated_at: timestamp("updated_at").notNull().defaultNow(),
});

// ============================================
// AI GENERATED VIDEOS
// ============================================

export const videosTable = pgTable("videos", {
  id: uuid("id").primaryKey().defaultRandom(),
  project_id: uuid("project_id")
    .notNull()
    .references(() => projectsTable.id, { onDelete: "cascade" }),
  user_id: uuid("user_id")
    .notNull()
    .references(() => usersTable.id, { onDelete: "cascade" }),
  video_url: text("video_url").notNull(),
  style: videoStyleEnum("style").notNull(),
  ai_captions: jsonb("ai_captions").$type<{
    instagram?: {
      text: string;
      hashtags: string;
    };
    facebook?: {
      title: string;
      text: string;
    };
    youtube_shorts?: {
      title: string;
      description: string;
    };
    tiktok?: {
      text: string;
    };
    linkedin?: {
      title: string;
      text: string;
    };
    x?: {
      text: string;
    };
  }>(),
  metadata: jsonb("metadata"),
  created_at: timestamp("created_at").notNull().defaultNow(),
});

// ============================================
// SOCIAL MEDIA CONNECTIONS
// ============================================

export const socialConnectionsTable = pgTable("social_connections", {
  id: uuid("id").primaryKey().defaultRandom(),
  user_id: uuid("user_id")
    .notNull()
    .references(() => usersTable.id, { onDelete: "cascade" }),
  platform: platformEnum("platform").notNull(),
  platform_user_id: text("platform_user_id").notNull(),
  platform_username: text("platform_username"),
  access_token: text("access_token").notNull(),
  refresh_token: text("refresh_token"),
  token_expires_at: timestamp("token_expires_at"),
  page_id: text("page_id"),
  instagram_account_id: text("instagram_account_id"),
  page_access_token: text("page_access_token"),
  platform_metadata: jsonb("platform_metadata"),
  is_active: boolean("is_active").notNull().default(true),
  connected_at: timestamp("connected_at").notNull().defaultNow(),
  last_used_at: timestamp("last_used_at"),
  last_token_refresh: timestamp("last_token_refresh"),
});

// ============================================
// SCHEDULED & POSTED CONTENT
// ============================================

export const scheduledPostsTable = pgTable("scheduled_posts", {
  id: uuid("id").primaryKey().defaultRandom(),
  user_id: uuid("user_id")
    .notNull()
    .references(() => usersTable.id, { onDelete: "cascade" }),
  video_id: uuid("video_id")
    .notNull()
    .references(() => videosTable.id, { onDelete: "cascade" }),
  connection_id: uuid("connection_id")
    .notNull()
    .references(() => socialConnectionsTable.id, { onDelete: "cascade" }),
  platform: platformEnum("platform").notNull(),
  scheduled_for: timestamp("scheduled_for").notNull(),
  status: postStatusEnum("status").notNull().default("scheduled"),
  captions: jsonb("captions").$type<{
    instagram?: { text: string; hashtags: string };
    facebook?: { title: string; text: string };
    youtube?: { title: string; description: string };
    tiktok?: { text: string };
  }>(),
  hashtags: text("hashtags").array(),
  platform_post_id: text("platform_post_id"),
  platform_url: text("platform_url"),
  error_message: text("error_message"),
  posted_at: timestamp("posted_at"),
  created_at: timestamp("created_at").notNull().defaultNow(),
  updated_at: timestamp("updated_at").notNull().defaultNow(),
});

// ============================================
// ANALYTICS & PERFORMANCE
// ============================================

export const postAnalyticsTable = pgTable("post_analytics", {
  id: uuid("id").primaryKey().defaultRandom(),
  scheduled_post_id: uuid("scheduled_post_id")
    .notNull()
    .references(() => scheduledPostsTable.id, { onDelete: "cascade" }),
  views: integer("views").default(0),
  likes: integer("likes").default(0),
  comments: integer("comments").default(0),
  shares: integer("shares").default(0),
  engagement_rate: integer("engagement_rate").default(0),
  last_synced_at: timestamp("last_synced_at"),
  created_at: timestamp("created_at").notNull().defaultNow(),
  updated_at: timestamp("updated_at").notNull().defaultNow(),
});

// ============================================
// USAGE TRACKING
// ============================================

export const usageLogsTable = pgTable("usage_logs", {
  id: uuid("id").primaryKey().defaultRandom(),
  user_id: uuid("user_id")
    .notNull()
    .references(() => usersTable.id, { onDelete: "cascade" }),
  action: text("action").notNull(),
  credits_used: integer("credits_used").default(0),
  metadata: jsonb("metadata"),
  created_at: timestamp("created_at").notNull().defaultNow(),
});

// ============================================
// TYPE EXPORTS
// ============================================

export type InsertUser = typeof usersTable.$inferInsert;
export type SelectUser = typeof usersTable.$inferSelect;

export type InsertSubscription = typeof subscriptionsTable.$inferInsert;
export type SelectSubscription = typeof subscriptionsTable.$inferSelect;

export type InsertWaitlist = typeof waitlistTable.$inferInsert;
export type SelectWaitlist = typeof waitlistTable.$inferSelect;

export type InsertCampaign = typeof campaignsTable.$inferInsert;
export type SelectCampaign = typeof campaignsTable.$inferSelect;

export type InsertProject = typeof projectsTable.$inferInsert;
export type SelectProject = typeof projectsTable.$inferSelect;

export type InsertVideo = typeof videosTable.$inferInsert;
export type SelectVideo = typeof videosTable.$inferSelect;

export type InsertSocialConnection = typeof socialConnectionsTable.$inferInsert;
export type SelectSocialConnection = typeof socialConnectionsTable.$inferSelect;

export type InsertScheduledPost = typeof scheduledPostsTable.$inferInsert;
export type SelectScheduledPost = typeof scheduledPostsTable.$inferSelect;

export type InsertPostAnalytics = typeof postAnalyticsTable.$inferInsert;
export type SelectPostAnalytics = typeof postAnalyticsTable.$inferSelect;

export type InsertUsageLog = typeof usageLogsTable.$inferInsert;
export type SelectUsageLog = typeof usageLogsTable.$inferSelect;
