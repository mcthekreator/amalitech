DROP TABLE IF EXISTS "mat094";

CREATE TABLE "public"."mat094" (
    "mat904_number" character varying NOT NULL,
    "creation_date" timestamp NOT NULL,
    "modification_date" timestamp NOT NULL,
    "created_by" character varying NOT NULL,
    "state" jsonb NOT NULL,
    "part_number" character varying,
    CONSTRAINT "PK_0ee130b55e190c9ba9bed3dff7d" PRIMARY KEY ("mat904_number")
) WITH (oids = false);

ALTER TABLE
    ONLY "public"."mat094"
ADD
    CONSTRAINT "FK_fb41bf0dc960b111cc7fba0bab9" FOREIGN KEY (part_number) REFERENCES chainflex(part_number) NOT DEFERRABLE;