ALTER TABLE
  configuration_snapshot
ADD CONSTRAINT
  fk_configuration_snapshot
FOREIGN KEY
  (is_snapshot_of)
REFERENCES
  configuration(id);