CREATE TYPE "public"."availability_status" AS ENUM('available', 'busy', 'fully_booked');--> statement-breakpoint
CREATE TYPE "public"."booking_status" AS ENUM('pending', 'confirmed', 'completed', 'cancelled');--> statement-breakpoint
CREATE TYPE "public"."session_mode" AS ENUM('text', 'voice', 'video');--> statement-breakpoint
CREATE TYPE "public"."membership_tier" AS ENUM('curator', 'strategist', 'sovereign');--> statement-breakpoint
CREATE TABLE "professionals" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"role" text NOT NULL,
	"niche" text NOT NULL,
	"bio" text NOT NULL,
	"rating" real DEFAULT 5 NOT NULL,
	"review_count" integer DEFAULT 0 NOT NULL,
	"price_text" real NOT NULL,
	"price_voice" real NOT NULL,
	"price_video" real NOT NULL,
	"availability_status" "availability_status" DEFAULT 'available' NOT NULL,
	"languages" text DEFAULT 'English' NOT NULL,
	"photo_url" text NOT NULL,
	"specializations" text,
	"years_experience" integer
);
--> statement-breakpoint
CREATE TABLE "bookings" (
	"id" serial PRIMARY KEY NOT NULL,
	"professional_id" integer NOT NULL,
	"professional_name" text NOT NULL,
	"mode" "session_mode" NOT NULL,
	"scheduled_at" text NOT NULL,
	"duration_minutes" integer DEFAULT 60 NOT NULL,
	"total_price" real NOT NULL,
	"status" "booking_status" DEFAULT 'pending' NOT NULL,
	"client_name" text NOT NULL,
	"client_email" text NOT NULL,
	"notes" text,
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "memberships" (
	"id" serial PRIMARY KEY NOT NULL,
	"tier" "membership_tier" NOT NULL,
	"name" text NOT NULL,
	"price" real NOT NULL,
	"description" text NOT NULL,
	"features" text NOT NULL,
	"highlighted" boolean DEFAULT false NOT NULL
);
--> statement-breakpoint
CREATE TABLE "lexicons" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"description" text NOT NULL,
	"terms" text NOT NULL,
	"category" text NOT NULL,
	"professional_id" integer
);
--> statement-breakpoint
CREATE TABLE "users" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"email" text NOT NULL,
	"membership_tier" text DEFAULT 'curator' NOT NULL,
	"created_at" timestamp DEFAULT now(),
	CONSTRAINT "users_email_unique" UNIQUE("email")
);
--> statement-breakpoint
CREATE TABLE "metrics" (
	"id" serial PRIMARY KEY NOT NULL,
	"user_id" integer,
	"event_name" text NOT NULL,
	"event_value" text,
	"created_at" timestamp DEFAULT now()
);
