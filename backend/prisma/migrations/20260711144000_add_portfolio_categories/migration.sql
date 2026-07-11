ALTER TABLE "Portfolio"
ADD COLUMN "categories" TEXT[] DEFAULT ARRAY[]::TEXT[];

UPDATE "Portfolio"
SET "categories" = ARRAY["category"]::TEXT[]
WHERE "categories" = ARRAY[]::TEXT[]
  AND "category" IS NOT NULL;
