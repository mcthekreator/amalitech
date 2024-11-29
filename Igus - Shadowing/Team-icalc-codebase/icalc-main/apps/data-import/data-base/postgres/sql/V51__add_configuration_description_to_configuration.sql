ALTER TABLE configuration
ADD COLUMN description character varying DEFAULT NULL;

UPDATE configuration_snapshot
SET configuration_data = jsonb_set(
    configuration_data,
    '{description}',
    'null'::jsonb
)
WHERE NOT (configuration_data ? 'description');