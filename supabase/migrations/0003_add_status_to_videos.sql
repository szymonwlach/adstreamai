CREATE TABLE "campaigns" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" uuid NOT NULL,
	"name" text NOT NULL,
	"description" text NOT NULL,
	"product_image_url" text NOT NULL,
	"max_videos" integer,
	"videos_generated" integer DEFAULT 0 NOT NULL,
	"total_views" integer DEFAULT 0,
	"total_likes" integer DEFAULT 0,
	"total_shares" integer DEFAULT 0,
	"is_archived" boolean DEFAULT false NOT NULL,
	"archived_at" timestamp,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "videos" ALTER COLUMN "video_url" DROP NOT NULL;--> statement-breakpoint
ALTER TABLE "projects" ADD COLUMN "campaign_id" uuid;--> statement-breakpoint
ALTER TABLE "projects" ADD COLUMN "quality" text NOT NULL;--> statement-breakpoint
ALTER TABLE "projects" ADD COLUMN "duration" integer;--> statement-breakpoint
ALTER TABLE "videos" ADD COLUMN "video_title" text NOT NULL;--> statement-breakpoint
ALTER TABLE "videos" ADD COLUMN "status" "project_status" DEFAULT 'processing' NOT NULL;--> statement-breakpoint
ALTER TABLE "videos" ADD COLUMN "language" text DEFAULT 'en' NOT NULL;--> statement-breakpoint
ALTER TABLE "videos" ADD COLUMN "quality" text DEFAULT '720p' NOT NULL;--> statement-breakpoint
ALTER TABLE "videos" ADD COLUMN "updated_at" timestamp DEFAULT now() NOT NULL;--> statement-breakpoint
ALTER TABLE "campaigns" ADD CONSTRAINT "campaigns_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "projects" ADD CONSTRAINT "projects_campaign_id_campaigns_id_fk" FOREIGN KEY ("campaign_id") REFERENCES "public"."campaigns"("id") ON DELETE cascade ON UPDATE no action;