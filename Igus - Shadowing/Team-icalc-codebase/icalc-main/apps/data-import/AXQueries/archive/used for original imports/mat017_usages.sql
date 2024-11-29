SELECT
  bom_table.NAME AS part_number,
  bom_table.BOMID AS bom_id,
  bom.ITEMID AS mat_number
FROM
  [IWH_TST].[core_app].[t_DEdAX40BOMTABLE] bom_table
  INNER JOIN [IWH_TST].[core_app].[t_DEdAX40BOM] bom ON bom_table.BOMID = bom.BOMID
WHERE
  bom_table.NAME LIKE 'CF%'
  AND bom_table.NAME NOT LIKE 'CF.25%'
  AND bom_table.NAME NOT LIKE 'CF %'
  AND bom_table.BOMID LIKE 'MAT904%'
  AND bom.ITEMID LIKE 'MAT017%';