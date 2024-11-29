-- remove existing calculation & configuration data
DELETE FROM
  "calculation_mat904_status";

DELETE FROM
  "single_cable_calculation";

DELETE FROM
  "calculation";

DELETE FROM
  "configuration";

-- replace mat904_number with mat_number in configuration table
ALTER TABLE
  "public"."configuration" RENAME COLUMN mat904_number TO mat_number;

-- rename table calculation_mat904_status to table calculation_configuration_status & rename mat904Id column
ALTER TABLE
  "public"."calculation_mat904_status" RENAME TO calculation_configuration_status;

ALTER TABLE
  "public"."calculation_configuration_status" RENAME COLUMN "mat904Id" TO "configurationId";

-- replace 'line' with 'cable' in chainflex table
DELETE FROM
  "chainflex";

ALTER TABLE
  "public"."chainflex" RENAME COLUMN line_structure TO cable_structure;

ALTER TABLE
  "public"."chainflex" RENAME COLUMN line_structure_information TO cable_structure_information;

-- replace 'mat017' with 'mat017Item'
ALTER TABLE
  "public"."favorites_to_mat017" RENAME TO favorites_to_mat017_item;

ALTER TABLE
  "public"."mat017_usages" RENAME TO mat017_item_usages;

ALTER TABLE
  "public"."mat017" RENAME TO mat017_item;

ALTER TABLE
  "public"."mat017_item" RENAME COLUMN mat017_group TO mat017_item_group;