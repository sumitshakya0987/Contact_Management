CREATE TABLE "saved_contacts" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"email" text,
	"phone" text,
	"company" text,
	"created_at" timestamp DEFAULT now()
);
