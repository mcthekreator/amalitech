-- CALCULATION CALCULATION-NUMBER
-- Step 1: Add a temporary calculation number column
ALTER TABLE calculation ADD COLUMN temp_calc_number TEXT;

-- Step 2: Remove tabs and spaces, creating potential duplicates
UPDATE calculation
SET temp_calc_number = regexp_replace(
    replace(calculation_number, ' ', ''),
    E'\t+', '',
    'g'
);

-- Step 3: Create a temporary table to store unique temp_calc_number values
CREATE TEMP TABLE temp_calculation AS
SELECT calculation_number, temp_calc_number,
       CASE
           WHEN calculation_number != temp_calc_number THEN true
           ELSE false
       END AS has_spaces_or_tabs
FROM calculation;

-- Step 4: Identify and resolve duplicates by adding underscores
WITH existing_numbers AS (
    SELECT temp_calc_number
    FROM temp_calculation
    WHERE has_spaces_or_tabs = false
),
numbered_duplicates AS (
    SELECT calculation_number, temp_calc_number, has_spaces_or_tabs,
           ROW_NUMBER() OVER (PARTITION BY temp_calc_number ORDER BY calculation_number) AS row_num,
           COUNT(*) OVER (PARTITION BY temp_calc_number) AS cnt
    FROM temp_calculation
),
filtered_duplicates AS (
    SELECT nd.*
    FROM numbered_duplicates nd
    WHERE has_spaces_or_tabs
),
resolved_duplicates AS (
    SELECT fd.calculation_number,
           CASE 
               WHEN en.temp_calc_number IS NULL AND fd.row_num = 1 THEN fd.temp_calc_number
               WHEN fd.row_num = 1 THEN fd.temp_calc_number || '_'
               ELSE fd.temp_calc_number || repeat('_', fd.row_num::int - 1)
           END AS resolved_calc_number
    FROM filtered_duplicates fd
    LEFT JOIN existing_numbers en
    ON fd.temp_calc_number = en.temp_calc_number
)
-- Step 5: Update calculation table with resolved duplicates
UPDATE calculation c
SET calculation_number = rd.resolved_calc_number
FROM resolved_duplicates rd
WHERE c.calculation_number = rd.calculation_number
  AND c.calculation_number != rd.resolved_calc_number;

-- Step 6: Drop the temporary column
ALTER TABLE calculation DROP COLUMN temp_calc_number;

-- Step 7: Drop the temporary table
DROP TABLE temp_calculation;



-- CONFIGURATION MAT-NUMBER
-- Step 1: Add a temporary mat_number column to configuration
ALTER TABLE configuration ADD COLUMN temp_mat_number TEXT;

-- Step 2: Remove tabs and spaces from mat_number in configuration
UPDATE configuration
SET temp_mat_number = regexp_replace(
    replace(mat_number, ' ', ''),
    E'\t+', '',
    'g'
);

-- Step 3: Create a temporary table to store unique temp_mat_number values
CREATE TEMP TABLE temp_configuration AS
SELECT mat_number, temp_mat_number,
       CASE
           WHEN mat_number != temp_mat_number THEN true
           ELSE false
       END AS has_spaces_or_tabs
FROM configuration;

-- Step 4: Identify and resolve duplicates by adding underscores
WITH existing_numbers AS (
    SELECT temp_mat_number
    FROM temp_configuration
    WHERE has_spaces_or_tabs = false
),
numbered_duplicates AS (
    SELECT mat_number, temp_mat_number, has_spaces_or_tabs,
           ROW_NUMBER() OVER (PARTITION BY temp_mat_number ORDER BY mat_number) AS row_num,
           COUNT(*) OVER (PARTITION BY temp_mat_number) AS cnt
    FROM temp_configuration
),
filtered_duplicates AS (
    SELECT nd.*
    FROM numbered_duplicates nd
    WHERE has_spaces_or_tabs
),
resolved_duplicates AS (
    SELECT fd.mat_number,
           CASE 
               WHEN en.temp_mat_number IS NULL AND fd.row_num = 1 THEN fd.temp_mat_number
               WHEN fd.row_num = 1 THEN fd.temp_mat_number || '_'
               ELSE fd.temp_mat_number || repeat('_', fd.row_num::int - 1)
           END AS resolved_mat_number,
           fd.temp_mat_number,
           c.mat_number AS old_mat_number -- Get old mat_number directly from configuration table
    FROM filtered_duplicates fd
    LEFT JOIN existing_numbers en
    ON fd.temp_mat_number = en.temp_mat_number
    JOIN configuration c
    ON fd.mat_number = c.mat_number  -- Join to get the old mat_number
)
-- Store the results in a temporary table
SELECT * INTO TEMP TABLE temp_resolved_duplicates FROM resolved_duplicates;

-- Step 5: Update configuration_mat_number and configuration_data in configuration_snapshot for modified rows
UPDATE configuration_snapshot cs
SET configuration_mat_number = rd.resolved_mat_number,
    configuration_data = jsonb_set(cs.configuration_data, '{matNumber}', to_jsonb(rd.resolved_mat_number))
FROM temp_resolved_duplicates rd
WHERE cs.configuration_mat_number = rd.old_mat_number -- Compare against the original mat_number
  AND cs.configuration_mat_number != rd.resolved_mat_number;

-- Step 6: Update mat_number in configuration table
UPDATE configuration c
SET mat_number = rd.resolved_mat_number
FROM temp_resolved_duplicates rd
WHERE c.mat_number = rd.old_mat_number -- Compare against the original mat_number
  AND c.mat_number != rd.resolved_mat_number;

-- Step 7: Drop the temporary column
ALTER TABLE configuration DROP COLUMN temp_mat_number;

-- Step 8: Drop the temporary tables
DROP TABLE temp_configuration;
DROP TABLE temp_resolved_duplicates;