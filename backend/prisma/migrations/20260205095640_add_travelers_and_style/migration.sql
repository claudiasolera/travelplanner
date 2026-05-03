-- AlterTable
ALTER TABLE "Trip" ADD COLUMN     "travelStyle" TEXT NOT NULL DEFAULT 'confort',
ADD COLUMN     "travelersCount" INTEGER NOT NULL DEFAULT 1;
