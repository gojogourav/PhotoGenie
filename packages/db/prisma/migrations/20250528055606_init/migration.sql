/*
  Warnings:

  - The `status` column on the `Generation` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - Added the required column `modelId` to the `Photo` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "modelTypeEnum" AS ENUM ('Man', 'Women');

-- CreateEnum
CREATE TYPE "modelEthenicity" AS ENUM ('White', 'Black', 'Asian', 'SouthAsian', 'SouthEastAsian', 'AsianAmerican', 'Hispanic', 'EastAsian');

-- CreateEnum
CREATE TYPE "EyeColor" AS ENUM ('White', 'Black', 'Brown', 'Blue');

-- CreateEnum
CREATE TYPE "GenerationStatus" AS ENUM ('pending', 'success', 'failed');

-- AlterTable
ALTER TABLE "Generation" DROP COLUMN "status",
ADD COLUMN     "status" "GenerationStatus" NOT NULL DEFAULT 'pending';

-- AlterTable
ALTER TABLE "Photo" ADD COLUMN     "modelId" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "profilePic" TEXT;

-- CreateTable
CREATE TABLE "Model" (
    "id" TEXT NOT NULL,
    "type" "modelTypeEnum" NOT NULL,
    "age" INTEGER NOT NULL,
    "ethenicity" "modelEthenicity" NOT NULL DEFAULT 'SouthEastAsian',
    "eyeColor" "EyeColor" NOT NULL DEFAULT 'Brown',
    "isBald" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "Model_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Photo" ADD CONSTRAINT "Photo_modelId_fkey" FOREIGN KEY ("modelId") REFERENCES "Model"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
