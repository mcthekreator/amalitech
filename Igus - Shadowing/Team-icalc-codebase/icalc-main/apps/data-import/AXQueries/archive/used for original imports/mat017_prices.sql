SELECT
	  [ITEMID] as mat_number
      ,[EXTERNALITEMID] as supplier_item_number
	  ,[CUSTVENDRELATION] as cust_vend_relation
	  ,pricedisctable.MODIFIEDDATE  as modified_date
	  ,pricedisctable.MODIFIEDTIME as modified_time
	  ,[CURRENCY] as currency
      ,[QUANTITYAMOUNT] as quantity_amount
      ,[PRICEUNIT] as price_unit
	  ,[UNITID] as unit
	  ,pricedisctable.AMOUNT as amount
  FROM [IWH_TST].[core_app].[t_DEdAX40CUSTVENDEXTERNALITEM] externalItem
  JOIN (SELECT [AMOUNT]
			,[MODIFIEDDATE]
			,[MODIFIEDTIME]
			,[ITEMRELATION]
			,[CURRENCY]
			,[ACCOUNTRELATION]
			,[DATAAREAID]
			,[IGUPRIMVEND]
			,[QUANTITYAMOUNT]
			,[PRICEUNIT]
			,[UNITID]
		FROM [IWH_TST].[core_app].[t_DEdAX40PRICEDISCTABLE]
		WHERE [RELATION] = 0 
		AND [DATAAREAID] = 'igu' 
		AND [IGUPRIMVEND] = 1 
		AND [ITEMRELATION] LIKE 'MAT017%') pricedisctable
	ON externalItem.CUSTVENDRELATION = pricedisctable.ACCOUNTRELATION 
	AND externalItem.ITEMID = pricedisctable.ITEMRELATION
  
  WHERE [ITEMID] LIKE 'MAT017%'
	AND externalItem.DATAAREAID = 'igu' 	
	AND [EXTERNALITEMID] IS NOT NULL	
	AND [EXTERNALITEMID] != '' 
	AND [EXTERNALITEMID] != '.'  
  ORDER BY [ITEMID]