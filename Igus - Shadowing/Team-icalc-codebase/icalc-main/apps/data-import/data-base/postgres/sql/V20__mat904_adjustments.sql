DROP TABLE IF EXISTS "mat904";

CREATE TABLE "public"."mat904" (
  "id" uuid DEFAULT uuid_generate_v4() NOT NULL,
  "mat904_number" character varying NOT NULL,
  "labeling_left" character varying,
  "labeling_right" character varying,
  "batch_size" integer,
  "creation_date" timestamp NOT NULL,
  "modification_date" timestamp NOT NULL,
  "created_by" character varying NOT NULL,
  "modified_by" character varying NOT NULL,
  "state" jsonb NOT NULL,
  "part_number" character varying,
  CONSTRAINT "PK_0ddcd0712d5486783d09f2b4011" PRIMARY KEY ("id"),
  CONSTRAINT "UQ_71cacec05a0520452b89abd7868" UNIQUE ("mat904_number")
) WITH (oids = false);

ALTER TABLE
  ONLY "public"."mat904"
ADD
  CONSTRAINT "FK_40a052be0d0a1cb438e3df18fc2" FOREIGN KEY (part_number) REFERENCES chainflex(part_number) NOT DEFERRABLE;