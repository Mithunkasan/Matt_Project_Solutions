-- CreateTable
CREATE TABLE "workshops" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "college" TEXT NOT NULL,
    "department" TEXT NOT NULL,
    "organizer" TEXT NOT NULL,
    "team" TEXT NOT NULL,
    "date" TIMESTAMP(3) NOT NULL,
    "duration" TEXT NOT NULL,
    "location" TEXT NOT NULL,
    "attendees" INTEGER NOT NULL,
    "status" TEXT NOT NULL,
    "fee" DOUBLE PRECISION,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "workshops_pkey" PRIMARY KEY ("id")
);
