/*
  Warnings:

  - The values [White,Black,Brown,Blue] on the enum `EyeColor` will be removed. If these variants are still used in the database, this will fail.
  - The values [White,Black,Asian,SouthAsian,SouthEastAsian,AsianAmerican,Hispanic,EastAsian] on the enum `modelEthenicity` will be removed. If these variants are still used in the database, this will fail.
  - Added the required column `name` to the `Model` table without a default value. This is not possible if the table is not empty.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "EyeColor_new" AS ENUM ('blue', 'black', 'white', 'brown');
ALTER TABLE "Model" ALTER COLUMN "eyeColor" DROP DEFAULT;
ALTER TABLE "Model" ALTER COLUMN "eyeColor" TYPE "EyeColor_new" USING ("eyeColor"::text::"EyeColor_new");
ALTER TYPE "EyeColor" RENAME TO "EyeColor_old";
ALTER TYPE "EyeColor_new" RENAME TO "EyeColor";
DROP TYPE "EyeColor_old";
ALTER TABLE "Model" ALTER COLUMN "eyeColor" SET DEFAULT 'black';
COMMIT;

-- AlterEnum
BEGIN;
CREATE TYPE "modelEthenicity_new" AS ENUM ('white', 'black', 'asian', 'southAsian', 'eastAsian', 'hispanic');
ALTER TABLE "Model" ALTER COLUMN "ethenicity" DROP DEFAULT;
ALTER TABLE "Model" ALTER COLUMN "ethenicity" TYPE "modelEthenicity_new" USING ("ethenicity"::text::"modelEthenicity_new");
ALTER TYPE "modelEthenicity" RENAME TO "modelEthenicity_old";
ALTER TYPE "modelEthenicity_new" RENAME TO "modelEthenicity";
DROP TYPE "modelEthenicity_old";
ALTER TABLE "Model" ALTER COLUMN "ethenicity" SET DEFAULT 'southAsian';
COMMIT;

-- AlterTable
ALTER TABLE "Model" ADD COLUMN     "name" TEXT NOT NULL,
ALTER COLUMN "ethenicity" SET DEFAULT 'southAsian',
ALTER COLUMN "eyeColor" SET DEFAULT 'black';
