ALTER TABLE single_cable_calculation
ALTER COLUMN chain_flex_length TYPE numeric(10,2) USING chain_flex_length::numeric(10,2);

ALTER TABLE single_cable_calculation
ALTER COLUMN batch_size TYPE numeric(10,2) USING batch_size::numeric(10,2);