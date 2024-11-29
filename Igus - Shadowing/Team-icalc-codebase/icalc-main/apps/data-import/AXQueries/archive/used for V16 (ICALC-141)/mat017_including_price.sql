SELECT
  invent_table.ITEMID AS mat_number,
  invent_text.IGSITEMDESCRIPTIONFIELD1 AS item_description_1,
  invent_text.IGSITEMDESCRIPTIONFIELD2 AS item_description_2,
  invent_table.IGUITEMTYPE AS mat017_group,
  cust_vend_external_item.EXTERNALITEMID AS supplier_item_number,
  cust_vend_external_item.CUSTVENDRELATION AS cust_vend_relation, -- kept for possible future use (see: ICALC-141)
  price_disc_table.CURRENCY AS currency, -- kept for possible future use (see: ICALC-141)
  price_disc_table.UNITID AS unit, -- kept for possible future use (see: ICALC-141)
  price_disc_table.PRICEUNIT AS price_unit,
  price_disc_table.AMOUNT AS amount,
  price_disc_table.AMOUNT / COALESCE(NULLIF(price_disc_table.PRICEUNIT, 0), 1) AS amount_divided_by_price_unit
FROM
  [IWH_TST].[core_app].[t_DEdAX40INVENTTABLE] invent_table
  LEFT JOIN [IWH_TST].[core_app].[t_DEdAX40INVENTTXT] invent_text ON invent_text.ITEMID = invent_table.ITEMID
  LEFT JOIN [IWH_TST].[core_app].[t_DEdAX40CUSTVENDEXTERNALITEM] cust_vend_external_item ON cust_vend_external_item.ITEMID = invent_table.ITEMID
  LEFT JOIN [IWH_TST].[core_app].[t_DEdAX40PRICEDISCTABLE] price_disc_table ON price_disc_table.ITEMRELATION = invent_table.ITEMID AND cust_vend_external_item.CUSTVENDRELATION = price_disc_table.ACCOUNTRELATION
WHERE
  invent_table.ITEMID LIKE 'MAT017%'
  AND invent_table.DATAAREAID = 'igu'
  AND invent_text.DATAAREAID = 'igu'
  AND invent_text.LANGUAGEID = 'de'
  AND cust_vend_external_item.DATAAREAID = 'igu'
  AND cust_vend_external_item.EXTERNALITEMID IS NOT NULL
  AND cust_vend_external_item.EXTERNALITEMID != ''
  AND cust_vend_external_item.EXTERNALITEMID != '.'
  AND price_disc_table.QUANTITYAMOUNT = 0
  AND price_disc_table.RELATION = 0
  AND price_disc_table.DATAAREAID = 'igu'
  AND price_disc_table.IGUPRIMVEND = 1
ORDER BY
  invent_table.ITEMID;