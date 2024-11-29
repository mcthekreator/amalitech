ALTER TABLE
  mat017_item
ALTER COLUMN
  supplier_item_number DROP NOT NULL;

UPDATE
  mat017_item
SET
  amount_divided_by_price_unit = ROUND(amount_divided_by_price_unit, 2);

UPDATE
  mat017_item
SET
  amount_divided_by_price_unit = 0.01
WHERE
  amount_divided_by_price_unit < 0.01;