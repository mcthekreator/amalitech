DELETE FROM
  "calculation_configuration_status";

DELETE FROM
  "single_cable_calculation";

DELETE FROM
  "calculation";

DELETE FROM
  "configuration";

-- Table Definition ----------------------------------------------

CREATE TABLE configuration_snapshot (
    id uuid DEFAULT uuid_generate_v4() PRIMARY KEY,
    is_snapshot_of character varying NOT NULL,
    work_step_prices json NOT NULL,
    configuration_data jsonb NOT NULL,
    creation_date timestamp without time zone NOT NULL DEFAULT 'now'::text::timestamp(6) with time zone,
    modification_date timestamp without time zone NOT NULL DEFAULT 'now'::text::timestamp(6) with time zone,
    "created_by " uuid REFERENCES "user"(id),
    "modified_by " uuid REFERENCES "user"(id)
);

-- Indices -------------------------------------------------------

CREATE UNIQUE INDEX "PK_6ac8cb2048f21f5c724dcd2e30d" ON configuration_snapshot(id uuid_ops);


-- Alter SCC ----------------------------------------------

ALTER TABLE single_cable_calculation
ALTER COLUMN configuration_id DROP NOT NULL;

ALTER TABLE single_cable_calculation
ALTER COLUMN batch_size SET NOT NULL;

ALTER TABLE single_cable_calculation
ADD COLUMN snapshot_id uuid REFERENCES configuration_snapshot(id) UNIQUE;
