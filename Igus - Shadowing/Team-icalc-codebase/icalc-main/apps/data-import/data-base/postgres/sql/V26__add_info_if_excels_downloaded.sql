
ALTER TABLE "public"."calculation"
ADD COLUMN production_plan_excel_downloaded BOOLEAN DEFAULT FALSE;

ALTER TABLE "public"."calculation"
ADD COLUMN calculation_excel_downloaded BOOLEAN DEFAULT FALSE;
