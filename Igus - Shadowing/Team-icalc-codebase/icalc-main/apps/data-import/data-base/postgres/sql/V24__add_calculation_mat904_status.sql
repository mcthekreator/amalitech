DELETE FROM
  mat904_calculations_calculation;

DELETE FROM
  mat904;

DELETE FROM
  calculation;

DROP TABLE IF EXISTS "calculation_mat904_status";

CREATE TABLE "public"."calculation_mat904_status" (
  "calculationId" uuid NOT NULL,
  "mat904Id" uuid NOT NULL,
  "status" character varying NOT NULL,
  "modification_date" timestamp NOT NULL,
  "modified_by" character varying NOT NULL,
  CONSTRAINT "PK_f9d72b3012f04ffd2313201c4c7" PRIMARY KEY ("calculationId", "mat904Id")
) WITH (oids = false);

ALTER TABLE
  ONLY "public"."calculation_mat904_status"
ADD
  CONSTRAINT "FK_0a6a8fd42e391c2c65b694d6bcb" FOREIGN KEY ("calculationId") REFERENCES calculation(id) NOT DEFERRABLE;

ALTER TABLE
  ONLY "public"."calculation_mat904_status"
ADD
  CONSTRAINT "FK_0e69f48cf8816d055868eb45009" FOREIGN KEY ("mat904Id") REFERENCES mat904(id) NOT DEFERRABLE;