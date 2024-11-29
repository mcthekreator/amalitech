ALTER TABLE
  configuration_snapshot
ADD
  COLUMN configuration_mat_number character varying;

UPDATE
  configuration_snapshot
SET
  configuration_mat_number = configuration_data ->> 'matNumber';