
DROP TABLE IF EXISTS "mat904_calculations_calculation";

DROP TABLE IF EXISTS "calculation";

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

CREATE TABLE "public"."calculation" (
  "id" uuid DEFAULT uuid_generate_v4() NOT NULL,
  "calculation_number" character varying NOT NULL,
  "calculation_factor" numeric(10, 2) NOT NULL,
  "customer_type" character varying NOT NULL,
  "creation_date" timestamp NOT NULL,
  "created_by" character varying NOT NULL,
  "modification_date" timestamp NOT NULL,
  "modified_by" character varying NOT NULL,
  CONSTRAINT "PK_67320bae23a5bfa027f881c271b" PRIMARY KEY ("id"),
  CONSTRAINT "UQ_768211ef919c848fe00fc6ebc88" UNIQUE ("calculation_number")
) WITH (oids = false);

CREATE TABLE "public"."mat904_calculations_calculation" (
  "mat904Id" uuid NOT NULL,
  "calculationId" uuid NOT NULL,
  CONSTRAINT "PK_b74f8d68f4e3d7eb9939beebab6" PRIMARY KEY ("mat904Id", "calculationId")
) WITH (oids = false);

CREATE INDEX "IDX_22ac5cf4088e43439024604f9c" ON "public"."mat904_calculations_calculation" USING btree ("mat904Id");

CREATE INDEX "IDX_7b645444db982c6b31f5a24f74" ON "public"."mat904_calculations_calculation" USING btree ("calculationId");

ALTER TABLE
  ONLY "public"."mat904_calculations_calculation"
ADD
  CONSTRAINT "FK_22ac5cf4088e43439024604f9c8" FOREIGN KEY ("mat904Id") REFERENCES mat904(id) ON UPDATE CASCADE ON DELETE CASCADE NOT DEFERRABLE;

ALTER TABLE
  ONLY "public"."mat904_calculations_calculation"
ADD
  CONSTRAINT "FK_7b645444db982c6b31f5a24f74c" FOREIGN KEY ("calculationId") REFERENCES calculation(id) NOT DEFERRABLE;
