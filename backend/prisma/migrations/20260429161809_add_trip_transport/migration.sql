-- CreateTable
CREATE TABLE "TripTransport" (
    "id" TEXT NOT NULL,
    "tripId" TEXT NOT NULL,
    "mode" TEXT NOT NULL,
    "origin" TEXT NOT NULL,
    "destination" TEXT NOT NULL,
    "duration" INTEGER,
    "price" DOUBLE PRECISION,
    "lineaRecomendada" TEXT,
    "tipoTransporte" TEXT,
    "operador" TEXT,
    "notas" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "TripTransport_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "TripTransport" ADD CONSTRAINT "TripTransport_tripId_fkey" FOREIGN KEY ("tripId") REFERENCES "Trip"("id") ON DELETE CASCADE ON UPDATE CASCADE;
