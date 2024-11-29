-- introduce risk factor columns to calculation table
ALTER TABLE
  calculation
ADD
  COLUMN mat017_item_risk_factor numeric(10, 3); -- Risk'22

ALTER TABLE
  calculation
ADD
  COLUMN mat017_item_and_work_step_risk_factor numeric(10, 3); -- Risk'07-22

-- set risk factors of active calculations to default values
UPDATE
  calculation
SET
  mat017_item_risk_factor = 1.12
WHERE
  calculation.status = 'IN_PROGRESS';

UPDATE
  calculation
SET
  mat017_item_and_work_step_risk_factor = 1.058
WHERE
  calculation.status = 'IN_PROGRESS';

-- set risk factors of locked calculations to 1
UPDATE
  calculation
SET
  mat017_item_risk_factor = 1
WHERE
  calculation.status = 'LOCKED';

UPDATE
  calculation
SET
  mat017_item_and_work_step_risk_factor = 1
WHERE
  calculation.status = 'LOCKED';