/*
  Warnings:

  - You are about to drop the `DiaryEntry` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `DiaryPhoto` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "DiaryEntry" DROP CONSTRAINT "DiaryEntry_tripId_fkey";

-- DropForeignKey
ALTER TABLE "DiaryPhoto" DROP CONSTRAINT "DiaryPhoto_diaryEntryId_fkey";

-- AlterTable
ALTER TABLE "Trip" ADD COLUMN     "coverImage" TEXT;

-- DropTable
DROP TABLE "DiaryEntry";

-- DropTable
DROP TABLE "DiaryPhoto";
