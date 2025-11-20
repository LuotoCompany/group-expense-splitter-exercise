DROP TABLE IF EXISTS "example";

CREATE TABLE IF NOT EXISTS "people" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" varchar(255) NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "people_name_unique" UNIQUE("name")
);

CREATE TABLE IF NOT EXISTS "settlements" (
	"id" serial PRIMARY KEY NOT NULL,
	"from_person_id" integer NOT NULL,
	"to_person_id" integer NOT NULL,
	"amount" numeric(12, 2) NOT NULL,
	"date" date NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "settlements_amount_positive" CHECK ("amount" > 0),
	CONSTRAINT "settlements_distinct_participants" CHECK ("from_person_id" <> "to_person_id"),
	CONSTRAINT "settlements_from_person_id_people_id_fk" FOREIGN KEY ("from_person_id") REFERENCES "people"("id") ON UPDATE cascade ON DELETE restrict,
	CONSTRAINT "settlements_to_person_id_people_id_fk" FOREIGN KEY ("to_person_id") REFERENCES "people"("id") ON UPDATE cascade ON DELETE restrict
);

CREATE INDEX IF NOT EXISTS "settlements_from_person_idx" ON "settlements" ("from_person_id");
CREATE INDEX IF NOT EXISTS "settlements_to_person_idx" ON "settlements" ("to_person_id");

