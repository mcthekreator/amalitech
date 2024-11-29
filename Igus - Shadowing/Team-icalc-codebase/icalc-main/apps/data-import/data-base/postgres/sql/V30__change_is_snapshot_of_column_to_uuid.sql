ALTER TABLE
  configuration_snapshot
ALTER COLUMN
  is_snapshot_of TYPE uuid USING is_snapshot_of :: uuid;