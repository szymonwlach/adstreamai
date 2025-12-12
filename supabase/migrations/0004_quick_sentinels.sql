ALTER TYPE "public"."video_style" ADD VALUE 'testimonial';--> statement-breakpoint
ALTER TABLE "campaigns" ALTER COLUMN "name" DROP NOT NULL;--> statement-breakpoint
ALTER TABLE "campaigns" ALTER COLUMN "description" DROP NOT NULL;--> statement-breakpoint
ALTER TABLE "projects" ALTER COLUMN "name" DROP NOT NULL;--> statement-breakpoint
ALTER TABLE "videos" ALTER COLUMN "video_url" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "videos" DROP COLUMN "status";--> statement-breakpoint
ALTER TABLE "videos" DROP COLUMN "language";--> statement-breakpoint
ALTER TABLE "videos" DROP COLUMN "quality";--> statement-breakpoint
ALTER TABLE "videos" DROP COLUMN "updated_at";