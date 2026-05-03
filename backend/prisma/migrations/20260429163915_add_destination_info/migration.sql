-- CreateTable
CREATE TABLE "TripDestinationInfo" (
    "id" TEXT NOT NULL,
    "tripId" TEXT NOT NULL,
    "data" JSONB NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "TripDestinationInfo_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "TripDestinationInfo_tripId_key" ON "TripDestinationInfo"("tripId");

-- AddForeignKey
ALTER TABLE "TripDestinationInfo" ADD CONSTRAINT "TripDestinationInfo_tripId_fkey" FOREIGN KEY ("tripId") REFERENCES "Trip"("id") ON DELETE CASCADE ON UPDATE CASCADE;
