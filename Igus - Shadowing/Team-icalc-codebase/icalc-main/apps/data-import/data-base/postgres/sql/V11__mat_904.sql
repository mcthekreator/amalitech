-- renames the table mat904

DROP TABLE IF EXISTS "mat094";

DROP TABLE IF EXISTS "mat904";

CREATE TABLE "public"."mat904" (
    "mat904_number" character varying NOT NULL,
    "creation_date" timestamp NOT NULL,
    "modification_date" timestamp NOT NULL,
    "created_by" character varying NOT NULL,
    "state" jsonb NOT NULL,
    "part_number" character varying,
    CONSTRAINT "PK_0ee130b55e190c9ba9bed3dff7d" PRIMARY KEY ("mat904_number")
) WITH (oids = false);