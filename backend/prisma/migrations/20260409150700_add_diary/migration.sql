/*
  Warnings:

  - A unique constraint covering the columns `[tripId,day]` on the table `DiaryEntry` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "DiaryEntry_tripId_day_key" ON "DiaryEntry"("tripId", "day");
