-- Remove unique constraint of snapshot_id on SingleCableCalculation
ALTER TABLE
  single_cable_calculation DROP CONSTRAINT single_cable_calculation_snapshot_id_key;

-- Expression that identifies the snapshots to be updated and the latest snapshot ID for each calculation
WITH snapshots AS (
  SELECT
    scc.calculation_id,
    cs.is_snapshot_of,
    array_agg(cs.id) as snapshot_ids,
    (
      SELECT
        snapshot_id
      FROM
        (
          SELECT
            snapshot_id,
            assignment_date,
            -- Rank each snapshot within the same calculation based on the assignment date
            -- The snapshot with the latest assignment date gets rank 1
            rank() OVER (
              ORDER BY
                assignment_date DESC
            ) as rank
          FROM
            single_cable_calculation
          WHERE
            snapshot_id = ANY(array_agg(cs.id)) -- Only consider snapshots that are in the array of snapshot IDs
        ) sub
      WHERE
        rank = 1 -- Only select the snapshot with the highest rank (latest assignment date)
      LIMIT
        1 -- Select the first one if there are many snapshots with the same assignment date (could happen while creating a copy of calculation)
    ) as latest_snapshot_id
  FROM
    single_cable_calculation scc
    JOIN configuration_snapshot cs ON scc.snapshot_id = cs.id
  GROUP BY
    scc.calculation_id,
    cs.is_snapshot_of
  HAVING
    COUNT(DISTINCT cs.id) > 1 -- Only consider configurations with more than one snapshot
) -- Update operation to set the snapshot ID in single_cable_calculation to the ID of the latest snapshot
UPDATE
  single_cable_calculation
SET
  snapshot_id = snapshots.latest_snapshot_id
FROM
  snapshots
WHERE
  single_cable_calculation.calculation_id = snapshots.calculation_id
  AND single_cable_calculation.snapshot_id = ANY(snapshots.snapshot_ids);

-- End of the update operation
-- Delete operation to remove snapshots that are not linked to any single cable calculation
DELETE FROM
  configuration_snapshot
WHERE
  id NOT IN (
    SELECT
      DISTINCT(snapshot_id)
    FROM
      single_cable_calculation
    WHERE
      snapshot_id IS NOT NULL
  );

-- End of the delete operation