CREATE TABLE IF NOT EXISTS "handler_workshops" (
    "id" TEXT NOT NULL,
    "date" TIMESTAMP(3) NOT NULL,
    "time" TEXT NOT NULL,
    "handlerEmail" TEXT NOT NULL,
    "handlerName" TEXT NOT NULL,
    "participantNames" TEXT NOT NULL,
    "college" TEXT NOT NULL,
    "department" TEXT NOT NULL,
    "topic" TEXT NOT NULL,
    "duration" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "handler_workshops_pkey" PRIMARY KEY ("id")
);
