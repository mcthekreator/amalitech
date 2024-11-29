DELETE FROM
  "calculation_mat904_status";

ALTER TABLE
  "public"."calculation_mat904_status" DROP CONSTRAINT "FK_0e69f48cf8816d055868eb45009";

ALTER TABLE
  "public"."calculation_mat904_status" DROP CONSTRAINT "FK_0a6a8fd42e391c2c65b694d6bcb";

DROP TABLE IF EXISTS "mat904_calculations_calculation";

DROP TABLE IF EXISTS "mat904";

DROP TABLE IF EXISTS "calculation";

-- Table Definition ----------------------------------------------
CREATE TABLE configuration (
  is_copy_of_configuration uuid REFERENCES configuration(id) ON DELETE
  SET
    NULL,
    id uuid DEFAULT uuid_generate_v4() PRIMARY KEY,
    mat904_number character varying NOT NULL UNIQUE,
    labeling_left character varying,
    labeling_right character varying,
    creation_date timestamp without time zone NOT NULL,
    modification_date timestamp without time zone NOT NULL,
    created_by character varying NOT NULL,
    modified_by character varying NOT NULL,
    state jsonb NOT NULL,
    part_number character varying
);

-- Indices -------------------------------------------------------
CREATE UNIQUE INDEX "PK_03bad512915052d2342358f0d8b" ON configuration(id uuid_ops);

CREATE UNIQUE INDEX "UQ_21f1cdb7df2fa2c4e802f8ab9e5" ON configuration(mat904_number text_ops);

ALTER TABLE
  "public"."calculation_mat904_status"
ADD
  CONSTRAINT "FK_0e69f48cf8816d055868eb45009" FOREIGN KEY ("mat904Id") REFERENCES configuration(id) NOT DEFERRABLE;

-- Table Definition ----------------------------------------------
CREATE TABLE calculation (
  id uuid DEFAULT uuid_generate_v4() PRIMARY KEY,
  calculation_number character varying NOT NULL UNIQUE,
  calculation_factor numeric(10, 2) NOT NULL,
  creation_date timestamp without time zone NOT NULL,
  created_by character varying NOT NULL,
  modification_date timestamp without time zone NOT NULL,
  modified_by character varying NOT NULL,
  is_copy_of_calculation uuid REFERENCES calculation(id) ON DELETE
  SET
    NULL,
    customer_type text,
    status text DEFAULT 'IN_PROGRESS' :: text
);

-- Indices -------------------------------------------------------
CREATE UNIQUE INDEX "PK_67320bae23a5bfa027f881c271b" ON calculation(id uuid_ops);

CREATE UNIQUE INDEX "UQ_768211ef919c848fe00fc6ebc88" ON calculation(calculation_number text_ops);

ALTER TABLE
  "public"."calculation_mat904_status"
ADD
  CONSTRAINT "FK_0a6a8fd42e391c2c65b694d6bcb" FOREIGN KEY ("calculationId") REFERENCES calculation(id) NOT DEFERRABLE;

ALTER TABLE
  "user"
ADD
  CONSTRAINT unique_user_id UNIQUE (id);

-- Table Definition ----------------------------------------------
CREATE TABLE single_cable_calculation (
  id uuid DEFAULT uuid_generate_v4() PRIMARY KEY,
  configuration_id uuid NOT NULL REFERENCES configuration(id) ON DELETE CASCADE ON UPDATE CASCADE,
  calculation_id uuid NOT NULL REFERENCES calculation(id) ON DELETE CASCADE ON UPDATE CASCADE,
  calculation_factor numeric(10, 2),
  batch_size integer,
  chain_flex_length integer,
  assignment_date timestamp without time zone NOT NULL DEFAULT 'now' :: text :: timestamp(6) with time zone,
  "assigned_by_id " uuid REFERENCES "user"(id)
);

-- Indices -------------------------------------------------------
CREATE UNIQUE INDEX "PK_d4a35e8c6dc44700085c632756f" ON single_cable_calculation(id uuid_ops);