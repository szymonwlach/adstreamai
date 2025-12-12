ALTER TABLE "users" ALTER COLUMN "credits" SET DEFAULT 1;--> statement-breakpoint
ALTER TABLE "projects" ADD COLUMN "selected_styles" "video_style"[] NOT NULL;--> statement-breakpoint
ALTER TABLE "users" DROP COLUMN "full_name";--> statement-breakpoint
ALTER TABLE "users" DROP COLUMN "avatar_url";