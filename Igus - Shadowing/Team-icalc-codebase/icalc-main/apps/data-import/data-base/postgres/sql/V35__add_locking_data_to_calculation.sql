ALTER TABLE
  calculation
ADD
  COLUMN locking_date timestamp without time zone;

ALTER TABLE
  calculation
ADD
  COLUMN locked_by character varying;

UPDATE
  calculation
SET
  locking_date = modification_date
WHERE
  calculation.status = 'LOCKED';

UPDATE
  calculation
SET
  locked_by = modified_by
WHERE
  calculation.status = 'LOCKED';