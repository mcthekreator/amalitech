SELECT
	  itable.ITEMID as mat_number
	 ,ISNULL(score_table.score, 0) as score
	 ,itext.IGSITEMDESCRIPTIONFIELD1 as item_description_1
	 ,itext.IGSITEMDESCRIPTIONFIELD2 as item_description_2
	 ,itable.IGUITEMTYPE as mat017_group
  FROM [IWH_TST].[core_app].[t_DEdAX40INVENTTABLE] itable
  LEFT JOIN [IWH_TST].[core_app].[t_DEdAX40INVENTTXT] itext
	ON itext.ITEMID = itable.ITEMID
  LEFT JOIN (SELECT COUNT(ITEMID) as score
	,[ITEMID]
	FROM [IWH_TST].[core_app].[t_DEdAX40BOM] bom
	WHERE [BOMID] LIKE 'MAT904%'
		AND [ITEMID] LIKE 'MAT017%'
	group by [ITEMID]) score_table
	on score_table.ITEMID = itable.ITEMID

  WHERE itable.ITEMID LIKE 'MAT017%'
	AND itable.DATAAREAID = 'igu'
	AND itext.DATAAREAID = 'igu'
	AND itext.LANGUAGEID = 'de'
  ORDER BY score_table.score desc

