/*
  Warnings:

  - You are about to drop the column `arrivalAirport` on the `Trip` table. All the data in the column will be lost.
  - You are about to drop the column `arrivalTime` on the `Trip` table. All the data in the column will be lost.
  - You are about to drop the column `checkIn` on the `Trip` table. All the data in the column will be lost.
  - You are about to drop the column `checkOut` on the `Trip` table. All the data in the column will be lost.
  - You are about to drop the column `departureAirport` on the `Trip` table. All the data in the column will be lost.
  - You are about to drop the column `departureTime` on the `Trip` table. All the data in the column will be lost.
  - You are about to drop the column `flightNumber` on the `Trip` table. All the data in the column will be lost.
  - You are about to drop the column `hotelAddress` on the `Trip` table. All the data in the column will be lost.
  - You are about to drop the column `hotelName` on the `Trip` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Itinerary" ADD COLUMN     "notes" TEXT;

-- AlterTable
ALTER TABLE "Trip" DROP COLUMN "arrivalAirport",
DROP COLUMN "arrivalTime",
DROP COLUMN "checkIn",
DROP COLUMN "checkOut",
DROP COLUMN "departureAirport",
DROP COLUMN "departureTime",
DROP COLUMN "flightNumber",
DROP COLUMN "hotelAddress",
DROP COLUMN "hotelName",
ADD COLUMN     "flights" JSONB,
ADD COLUMN     "hotels" JSONB,
ADD COLUMN     "status" TEXT NOT NULL DEFAULT 'PLANNING';
