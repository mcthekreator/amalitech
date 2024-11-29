DROP INDEX IF EXISTS "mat017_usages_part_number",
"mat017_usages_bom_id",
"mat017_usages_mat_number";

CREATE INDEX "mat017_usages_part_number" ON "mat017_usages" ("part_number");

CREATE INDEX "mat017_usages_bom_id" ON "mat017_usages" ("bom_id");

CREATE INDEX "mat017_usages_mat_number" ON "mat017_usages" ("mat_number");

DROP INDEX IF EXISTS "mat017_prices_mat_number",
"mat017_prices_supplier_item_number";

CREATE INDEX "mat017_prices_mat_number" ON "mat017_prices" ("mat_number");

CREATE INDEX "mat017_prices_supplier_item_number" ON "mat017_prices" ("supplier_item_number");

DROP INDEX IF EXISTS "chainflex_prices_part_number";

CREATE INDEX "chainflex_prices_part_number" ON "chainflex_prices" ("part_number");