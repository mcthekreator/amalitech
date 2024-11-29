ALTER TABLE
  single_cable_calculation
ADD
  COLUMN commercial_work_step_overrides jsonb NOT NULL DEFAULT '{}' :: jsonb;

/* set commercial_work_step_overrides field on single_cable_calculation */
UPDATE
  single_cable_calculation scc
SET
  commercial_work_step_overrides = subquery.commercial_work_step_overrides
FROM
  (
    SELECT
      scc_inner.id,
      jsonb_strip_nulls(
        jsonb_build_object(
          'projektierung',
          COALESCE(
            c.state -> 'workStepOverrides' -> 'projektierung',
            cs.configuration_data -> 'state' -> 'workStepOverrides' -> 'projektierung'
          ),
          'auftragsmanagement',
          COALESCE(
            c.state -> 'workStepOverrides' -> 'auftragsmanagement',
            cs.configuration_data -> 'state' -> 'workStepOverrides' -> 'auftragsmanagement'
          ),
          'einkaufDispo',
          COALESCE(
            c.state -> 'workStepOverrides' -> 'einkaufDispo',
            cs.configuration_data -> 'state' -> 'workStepOverrides' -> 'einkaufDispo'
          ),
          'transportStock',
          COALESCE(
            c.state -> 'workStepOverrides' -> 'transportStock',
            cs.configuration_data -> 'state' -> 'workStepOverrides' -> 'transportStock'
          )
        )
      ) AS commercial_work_step_overrides
    FROM
      single_cable_calculation scc_inner
      LEFT JOIN configuration c ON scc_inner.configuration_id = c.id
      LEFT JOIN configuration_snapshot cs ON scc_inner.snapshot_id = cs.id
  ) AS subquery
WHERE
  scc.id = subquery.id;

/* remove commercial work step overrides from configuration */
UPDATE
  configuration conf1
SET
  state = jsonb_set(
    state,
    '{workStepOverrides}',
    (
      SELECT
        jsonb_strip_nulls(
          jsonb_build_object(
            'consignment',
            conf1.state -> 'workStepOverrides' -> 'consignment',
            'strip',
            conf1.state -> 'workStepOverrides' -> 'strip',
            'shieldHandling',
            conf1.state -> 'workStepOverrides' -> 'shieldHandling',
            'skinning',
            conf1.state -> 'workStepOverrides' -> 'skinning',
            'crimp',
            conf1.state -> 'workStepOverrides' -> 'crimp',
            'labeling',
            conf1.state -> 'workStepOverrides' -> 'labeling',
            'drillingSealInsert',
            conf1.state -> 'workStepOverrides' -> 'drillingSealInsert',
            'test',
            conf1.state -> 'workStepOverrides' -> 'test',
            'sendTestReport',
            conf1.state -> 'workStepOverrides' -> 'sendTestReport',
            'cutUnder20MM',
            conf1.state -> 'workStepOverrides' -> 'cutUnder20MM',
            'cutOver20MM',
            conf1.state -> 'workStepOverrides' -> 'cutOver20MM',
            'testFieldPrep',
            conf1.state -> 'workStepOverrides' -> 'testFieldPrep',
            'package',
            conf1.state -> 'workStepOverrides' -> 'package'
          )
        )
      FROM
        configuration conf2
      WHERE
        conf1.id = conf2.id
    )
  );