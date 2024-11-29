ALTER TABLE mat017_item
  ALTER COLUMN modification_date TYPE timestamptz USING modification_date::timestamptz;

ALTER TABLE "user"
  ALTER COLUMN creation_date TYPE timestamptz USING creation_date::timestamptz,
  ALTER COLUMN creation_date SET DEFAULT CURRENT_TIMESTAMP(6),
  ALTER COLUMN modification_date TYPE timestamptz USING modification_date::timestamptz,
  ALTER COLUMN modification_date SET DEFAULT CURRENT_TIMESTAMP(6);


ALTER TABLE calculation_configuration_status
  ALTER COLUMN modification_date TYPE timestamptz USING modification_date::timestamptz;

ALTER TABLE configuration
  ALTER COLUMN creation_date TYPE timestamptz USING creation_date::timestamptz,
  ALTER COLUMN modification_date TYPE timestamptz USING modification_date::timestamptz;

ALTER TABLE calculation
  ALTER COLUMN creation_date TYPE timestamptz USING creation_date::timestamptz,
  ALTER COLUMN modification_date TYPE timestamptz USING modification_date::timestamptz,
  ALTER COLUMN locking_date TYPE timestamptz USING locking_date::timestamptz;

ALTER TABLE single_cable_calculation
  ALTER COLUMN assignment_date TYPE timestamptz USING assignment_date::timestamptz,
  ALTER COLUMN assignment_date SET DEFAULT CURRENT_TIMESTAMP(6);


ALTER TABLE configuration_snapshot
  ALTER COLUMN creation_date TYPE timestamptz USING creation_date::timestamptz,
  ALTER COLUMN creation_date SET DEFAULT CURRENT_TIMESTAMP(6),
  ALTER COLUMN modification_date TYPE timestamptz USING modification_date::timestamptz,
  ALTER COLUMN modification_date SET DEFAULT CURRENT_TIMESTAMP(6);
