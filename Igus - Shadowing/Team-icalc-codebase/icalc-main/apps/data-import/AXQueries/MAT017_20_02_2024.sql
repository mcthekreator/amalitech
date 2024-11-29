SELECT
  itable.ITEMID AS mat_number,
  itext.IGSITEMDESCRIPTIONFIELD1 AS item_description_1,
  itext.IGSITEMDESCRIPTIONFIELD2 AS item_description_2,
  itable.IGUITEMTYPE AS mat017_group
FROM
  core_app.t_DExIWHdedax40inventtable AS itable
  LEFT JOIN core_app.t_DExIWHdedax40inventtxt AS itext ON itext.ITEMID = itable.ITEMID
  AND itext.DATAAREAID = itable.DATAAREAID
WHERE
  itable.ITEMID LIKE N'MAT017%'
  AND itable.DATAAREAID = N'igu'
  AND itable.IGUARCHIVITEM = 0
  AND itable.PRIMARYVENDORID != ''
  AND itext.LANGUAGEID = N'de';