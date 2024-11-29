UPDATE
  configuration_snapshot
SET
  configuration_data = jsonb_set(
    configuration_data,
    '{state, workStepSet}',
    '"standard"'
  );

UPDATE
  configuration
SET
  state = jsonb_set(state, '{workStepSet}', '"standard"');