CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

DROP TABLE IF EXISTS "mat017";
CREATE TABLE "public"."mat017" (
    "id" uuid DEFAULT uuid_generate_v4() NOT NULL,
    "mat_number" character varying NOT NULL,
    "score" integer NOT NULL,
    "item_description_1" character varying,
    "item_description_2" character varying,
    "mat017_group" character varying,
    CONSTRAINT "PK_4e5ffc7388e8a812dbcae00e8ca" PRIMARY KEY ("id", "mat_number"),
    CONSTRAINT "UQ_715a6cbf459875ab07217eb446a" UNIQUE ("mat_number")
) WITH (oids = false);

DROP TABLE IF EXISTS "mat017_prices";
CREATE TABLE "public"."mat017_prices" (
    "id" uuid DEFAULT uuid_generate_v4() NOT NULL,
    "mat_number" character varying NOT NULL,
    "supplier_item_number" character varying NOT NULL,
    "cust_vend_relation" character varying,
    "modified_date" date NOT NULL,
    "modified_time" integer NOT NULL,
    "currency" character varying,
    "quantity_amount" numeric,
    "price_unit" numeric,
    "unit" character varying,
    "amount" numeric,
    CONSTRAINT "PK_14e24010e18b0ecd35cfe66caa9" PRIMARY KEY ("id")
) WITH (oids = false);