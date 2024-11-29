DROP TABLE IF EXISTS "chainflex";

CREATE TABLE "public"."chainflex" (
    "id" uuid DEFAULT uuid_generate_v4() NOT NULL,
    "part_number" character varying NOT NULL,
    "description" jsonb NOT NULL,
    "overall_shield" boolean NOT NULL,
    "outer_jacket" jsonb NOT NULL,
    "number_of_cores" character varying NOT NULL,
    "nominal_cross_section" jsonb NOT NULL,
    "outer_diameter" jsonb NOT NULL,
    "line_structure" jsonb NOT NULL,
    "shop_image_url" character varying NOT NULL,
    "ul" boolean,
    CONSTRAINT "PK_97e7eaedbb76edcf136e126e745" PRIMARY KEY ("id", "part_number"),
    CONSTRAINT "UQ_2dbf9b3667d828d61e25f789ea5" UNIQUE ("part_number")
) WITH (oids = false);