UPDATE configuration
SET state =
  jsonb_set(
    jsonb_set(
      state,
      '{connectorState,leftConnector,mat017ItemListWithWidenData}',
      COALESCE(
        (
          SELECT jsonb_agg(
            jsonb_set(
              element,
              '{overrides}',
              jsonb_build_object(
                'amountDividedByPriceUnit', element -> 'amountDividedByPriceUnit',
                'mat017ItemGroup', element -> 'mat017ItemGroup'
              ),
              true
            ) - 'amountDividedByPriceUnit' - 'mat017ItemGroup' - 'itemDescription1' - 'itemDescription2' - 'supplierItemNumber' - 'priceUnit' - 'amount' - 'score' - 'custVendRelation'
          )
          FROM jsonb_array_elements(state -> 'connectorState' -> 'leftConnector' -> 'mat017ItemListWithWidenData') AS element
        ),
        '[]'::jsonb
      ),
      true
    ),
    '{connectorState,rightConnector,mat017ItemListWithWidenData}',
    COALESCE(
      (
        SELECT jsonb_agg(
          jsonb_set(
            element,
            '{overrides}',
            jsonb_build_object(
              'amountDividedByPriceUnit', element -> 'amountDividedByPriceUnit',
              'mat017ItemGroup', element -> 'mat017ItemGroup'
            ),
            true
          ) - 'amountDividedByPriceUnit' - 'mat017ItemGroup' - 'itemDescription1' - 'itemDescription2' - 'supplierItemNumber' - 'priceUnit' - 'amount' - 'score' - 'custVendRelation'
        )
        FROM jsonb_array_elements(state -> 'connectorState' -> 'rightConnector' -> 'mat017ItemListWithWidenData') AS element
      ),
      '[]'::jsonb
    ),
    true
  )
WHERE (state -> 'connectorState' -> 'leftConnector' -> 'mat017ItemListWithWidenData' IS NOT NULL)
  OR (state -> 'connectorState' -> 'rightConnector' -> 'mat017ItemListWithWidenData' IS NOT NULL);

UPDATE configuration_snapshot
SET configuration_data =
  jsonb_set(
    jsonb_set(
      configuration_data,
      '{state,connectorState,leftConnector,mat017ItemListWithWidenData}',
      COALESCE(
        (
          SELECT jsonb_agg(
            jsonb_set(
              element,
              '{overrides}',
              jsonb_build_object(
                'amountDividedByPriceUnit', element -> 'amountDividedByPriceUnit',
                'mat017ItemGroup', element -> 'mat017ItemGroup',
                'itemDescription1', element -> 'itemDescription1',
                'itemDescription2', element -> 'itemDescription2',
                'supplierItemNumber', element -> 'supplierItemNumber',
                'supplierId', element -> 'custVendRelation'
              ),
              true
            ) - 'amountDividedByPriceUnit' - 'mat017ItemGroup' - 'itemDescription1' - 'itemDescription2' - 'supplierItemNumber' - 'priceUnit' - 'amount' - 'score' - 'custVendRelation'
          )
          FROM jsonb_array_elements(configuration_data -> 'state' -> 'connectorState' -> 'leftConnector' -> 'mat017ItemListWithWidenData') AS element
        ),
        '[]'::jsonb
      ),
      true
    ),
    '{state,connectorState,rightConnector,mat017ItemListWithWidenData}',
    COALESCE(
      (
        SELECT jsonb_agg(
          jsonb_set(
            element,
            '{overrides}',
            jsonb_build_object(
              'amountDividedByPriceUnit', element -> 'amountDividedByPriceUnit',
              'mat017ItemGroup', element -> 'mat017ItemGroup',
              'itemDescription1', element -> 'itemDescription1',
              'itemDescription2', element -> 'itemDescription2',
              'supplierItemNumber', element -> 'supplierItemNumber',
              'priceUnit', element -> 'priceUnit',
              'amount', element -> 'amount',
              'supplierId', element -> 'custVendRelation'
            ),
            true
          ) - 'amountDividedByPriceUnit' - 'mat017ItemGroup' - 'itemDescription1' - 'itemDescription2' - 'supplierItemNumber' - 'priceUnit' - 'amount' - 'score' - 'custVendRelation'
        )
        FROM jsonb_array_elements(configuration_data -> 'state' -> 'connectorState' -> 'rightConnector' -> 'mat017ItemListWithWidenData') AS element
      ),
      '[]'::jsonb
    ),
    true
  )
WHERE (configuration_data -> 'state' -> 'connectorState' -> 'leftConnector' -> 'mat017ItemListWithWidenData' IS NOT NULL)
  OR (configuration_data -> 'state' -> 'connectorState' -> 'rightConnector' -> 'mat017ItemListWithWidenData' IS NOT NULL);


