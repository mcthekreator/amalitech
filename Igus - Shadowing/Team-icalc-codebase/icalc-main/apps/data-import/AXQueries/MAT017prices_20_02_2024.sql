SELECT
  pricedisctable.ITEMRELATION AS mat_number,
  externalitem.EXTERNALITEMID AS supplier_item_number,
  externalitem.CUSTVENDRELATION AS supplier_id,
  pricedisctable.QUANTITYAMOUNT AS quantity_amount,
  pricedisctable.PRICEUNIT AS price_unit,
  pricedisctable.AMOUNT AS amount
FROM
  core_app.t_DExIWHdedax40pricedisctable AS pricedisctable
  LEFT OUTER JOIN core_app.t_DExIWHdedax40custvendexternalitem AS externalitem ON (
    pricedisctable.ACCOUNTRELATION = externalitem.CUSTVENDRELATION
    AND pricedisctable.ITEMRELATION = externalitem.ITEMID
    AND pricedisctable.DATAAREAID = externalitem.DATAAREAID
  )
WHERE
  pricedisctable.ITEMRELATION LIKE 'MAT017%'
  AND pricedisctable.MODULE = 2
  AND pricedisctable.DATAAREAID = 'igu'
  AND pricedisctable.IGUPRIMVEND = 1
  AND (
    pricedisctable.TODATE = '1900-01-01'
    OR pricedisctable.TODATE > CURRENT_TIMESTAMP 
  );