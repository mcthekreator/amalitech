-- add column 'inner_jacket' in chainflex table
ALTER TABLE
    chainflex
ADD
    COLUMN inner_jacket jsonb NOT NULL DEFAULT '{}' :: jsonb;

ALTER TABLE
    chainflex
ALTER COLUMN
    inner_jacket DROP DEFAULT;