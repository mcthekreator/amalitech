USE [iWH_DataHub_PRD]
GO

--	Description:			Datenbereitstellung für iCalc-Service
--	Author:					Andre Schmidt
--	Created:				23.08.2022
--	Userstory:				https://igusdev.atlassian.net/l/cp/wQ8jB87V
--	Expert Contact:			Stefan Boehland
--	Last Modified:			...
--	Last Modified By:		...
CREATE VIEW [iCalc].[vMAT017]
AS
SELECT
	mat_number			= itable.ITEMID
,	score				= ISNULL(score_table.score, 0)
,	item_description_1	= itext.IGSITEMDESCRIPTIONFIELD1
,	item_description_2	= itext.IGSITEMDESCRIPTIONFIELD2
,	mat017_group		= itable.IGUITEMTYPE
FROM		core_app.t_DExIWHdedax40inventtable	AS itable
LEFT JOIN	core_app.t_DExIWHdedax40inventtxt	AS itext	ON itext.ITEMID	= itable.ITEMID
LEFT JOIN	(
	SELECT
		score = COUNT(bom.ITEMID)
	,	bom.ITEMID
	FROM core_app.t_DExIWHdedax40bom AS bom
	WHERE
		bom.BOMID LIKE N'MAT904%'
	AND	bom.ITEMID LIKE N'MAT017%'
	GROUP BY
		bom.ITEMID
) AS score_table ON score_table.ITEMID = itable.ITEMID
WHERE
	itable.ITEMID		LIKE N'MAT017%'
AND itable.DATAAREAID	= N'igu'
AND itext.DATAAREAID	= N'igu'
AND itext.LANGUAGEID	= N'de'
;
GO

--	Description:				Datenbereitstellung für iCalc-Service
--	Author:					Andre Schmidt
--	Created:					23.08.2022
--	Userstory:				https://igusdev.atlassian.net/l/cp/wQ8jB87V
--	Expert Contact:			Stefan Boehland
--	Last Modified:			...
--	Last Modified By:		...
CREATE VIEW [iCalc].[vMAT017prices]
AS
SELECT
	mat_number			= externalItem.ITEMID
,	supplier_item_number= externalItem.EXTERNALITEMID
,	cust_vend_relation	= externalItem.CUSTVENDRELATION
,	modified_date		= pricedisctable.MODIFIEDDATE
,	modified_time		= pricedisctable.MODIFIEDTIME
,	currency			= pricedisctable.CURRENCY
,	quantity_amount		= pricedisctable.QUANTITYAMOUNT
,	price_unit			= pricedisctable.PRICEUNIT
,	unit				= pricedisctable.UNITID
,	amount				= pricedisctable.AMOUNT
FROM core_app.t_DExIWHdedax40custvendexternalitem AS externalItem
JOIN (
	SELECT
		AMOUNT
	,	MODIFIEDDATE
	,	MODIFIEDTIME
	,	ITEMRELATION
	,	CURRENCY
	,	ACCOUNTRELATION
	,	DATAAREAID
	,	IGUPRIMVEND
	,	QUANTITYAMOUNT
	,	PRICEUNIT
	,	UNITID
	FROM core_app.t_DExIWHdedax40pricedisctable
	WHERE
		RELATION		= 0
	AND	DATAAREAID		= N'igu'
	AND	IGUPRIMVEND		= 1
	AND	ITEMRELATION	LIKE N'MAT017%'
) AS pricedisctable	ON	externalItem.CUSTVENDRELATION	= pricedisctable.ACCOUNTRELATION
					AND	externalItem.ITEMID				= pricedisctable.ITEMRELATION
WHERE
	externalItem.ITEMID			LIKE N'MAT017%'
AND	externalItem.DATAAREAID		= N'igu'
AND	externalItem.EXTERNALITEMID	IS NOT NULL
AND	externalItem.EXTERNALITEMID	<> N''
AND	externalItem.EXTERNALITEMID	<> N'.'
;
GO

--	Description:				Datenbereitstellung für iCalc-Service
--	Author:					Andre Schmidt
--	Created:					23.08.2022
--	Userstory:				https://igusdev.atlassian.net/l/cp/wQ8jB87V
--	Expert Contact:			Stefan Boehland
--	Last Modified:			...
--	Last Modified By:		...
CREATE VIEW [iCalc].[vMAT017usages]
AS
SELECT
	part_number	= bom_table.NAME
,	bom_id		= bom_table.BOMID
,	mat_number	= bom.ITEMID
FROM		core_app.t_DExIWHdedax40bomtable	AS bom_table
INNER JOIN	core_app.t_DExIWHdedax40bom			AS bom			ON	bom_table.BOMID	= bom.BOMID
WHERE
	bom_table.NAME	LIKE		N'CF%'
AND	bom_table.NAME	NOT LIKE	N'CF.25%'
AND	bom_table.NAME	NOT LIKE	N'CF %'
AND	bom_table.BOMID	LIKE		N'MAT904%'
AND	bom.ITEMID		LIKE		N'MAT017%'
;
GO
