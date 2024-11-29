BEGIN TRANSACTION;

ALTER TABLE favorites
ADD COLUMN description jsonb NULL,
ADD COLUMN favorites_category_id uuid NULL;

-- CREATE TEMPORARY CATEGORY TO ENFORCE NOT NULL CONSTRAINT
INSERT INTO
    favorites_category (id, name)
VALUES
    (
        '00000000-0000-0000-0000-000000000000',
        '{"en": "temporary"}'
    ) ON CONFLICT (id) DO NOTHING;

-- UPDATE FAVORITES WITH THE CATEGORIES
UPDATE favorites
SET
    favorites_category_id = '00000000-0000-0000-0000-000000000000'
WHERE
    favorites_category_id IS NULL;

UPDATE favorites
SET
    description = jsonb_build_object ('de_DE', "name")
WHERE
    description IS NULL
    OR description = '{}';

ALTER TABLE favorites ADD CONSTRAINT "FK_72f6d1a0be0a42efbdbb3d6fdf23e8cf" FOREIGN KEY ("favorites_category_id") REFERENCES favorites_category ("id") ON DELETE SET NULL;

ALTER TABLE favorites
ALTER COLUMN favorites_category_id
SET
    NOT NULL;

COMMIT TRANSACTION;