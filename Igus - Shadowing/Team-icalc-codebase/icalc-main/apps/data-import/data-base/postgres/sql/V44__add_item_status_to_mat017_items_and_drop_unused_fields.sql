ALTER TABLE
  mat017_item
  RENAME COLUMN cust_vend_relation TO supplier_id;

ALTER TABLE
  mat017_item
  ADD COLUMN item_status text NOT NULL DEFAULT 'ACTIVE',
  DROP COLUMN currency,
  DROP COLUMN unit;
