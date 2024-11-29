-- add line structure information column to chainflex table

ALTER TABLE "public"."chainflex"
ADD COLUMN line_structure_information jsonb;