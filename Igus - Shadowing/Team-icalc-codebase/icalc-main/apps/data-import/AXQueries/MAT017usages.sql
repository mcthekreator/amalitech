SELECT
  part_number = bom_table.NAME,
  bom_id = bom_table.BOMID,
  mat_number = bom.ITEMID
FROM
  core_app.t_DExIWHdedax40bomtable AS bom_table
  INNER JOIN core_app.t_DExIWHdedax40bom AS bom ON bom_table.BOMID = bom.BOMID
WHERE
  bom_table.NAME LIKE N'CF%'
  AND bom_table.NAME NOT LIKE N'CF.25%'
  AND bom_table.NAME NOT LIKE N'CF %'
  AND bom_table.BOMID LIKE N'MAT904%'
  AND bom.ITEMID LIKE N'MAT017%';