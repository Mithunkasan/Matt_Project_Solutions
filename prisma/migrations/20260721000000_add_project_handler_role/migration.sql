-- Add project handler role and invitation support.
ALTER TYPE "Role" ADD VALUE IF NOT EXISTS 'PROJECT_HANDLER';

ALTER TABLE "projects" ADD COLUMN IF NOT EXISTS "handlerEmail" TEXT;

CREATE TABLE IF NOT EXISTS "project_handler_invites" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "token" TEXT NOT NULL,
    "expiresAt" TIMESTAMP(3) NOT NULL,
    "usedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "project_handler_invites_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX IF NOT EXISTS "project_handler_invites_token_key" ON "project_handler_invites"("token");
