DROP TABLE IF EXISTS "user";
CREATE TABLE "public"."user" (
    "id" uuid DEFAULT uuid_generate_v4() NOT NULL,
    "email" character varying NOT NULL,
    "first_name" character varying NOT NULL,
    "last_name" character varying NOT NULL,
    "hash" character varying NOT NULL,
    "hash_rt" character varying,
    "creation_date" timestamp DEFAULT NOW() NOT NULL,
    "modification_date" timestamp DEFAULT NOW() NOT NULL,
    "role" character varying NOT NULL,
    CONSTRAINT "PK_95c07c16136adcfdcb8221c1fc9" PRIMARY KEY ("id", "email"),
    CONSTRAINT "UQ_e12875dfb3b1d92d7d7c5377e22" UNIQUE ("email")
) WITH (oids = false);
