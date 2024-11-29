
DROP TABLE IF EXISTS "favorites_category";

CREATE TABLE "public"."favorites_category" (
    "id" uuid DEFAULT uuid_generate_v4() NOT NULL,  
    "name" jsonb NOT NULL,                          
    CONSTRAINT "PK_1e1e2d77fec54ff2b1da8f8c4f33f29" PRIMARY KEY ("id"), 
    CONSTRAINT "UQ_b8f5b490c82d45eeb4c28ff1f2ad72aa" UNIQUE ("name")
) WITH (oids = false);
