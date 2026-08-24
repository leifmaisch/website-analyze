CREATE TABLE "scans" (
	"id" text PRIMARY KEY NOT NULL,
	"domain" text NOT NULL,
	"result" jsonb NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE INDEX "scans_domain_idx" ON "scans" USING btree ("domain");