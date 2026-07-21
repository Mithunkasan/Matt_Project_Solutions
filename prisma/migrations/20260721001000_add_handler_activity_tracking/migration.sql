CREATE TABLE IF NOT EXISTS "shared_student_files" (
    "id" TEXT NOT NULL,
    "projectId" TEXT NOT NULL,
    "studentEmail" TEXT NOT NULL,
    "handlerEmail" TEXT NOT NULL,
    "fileName" TEXT NOT NULL,
    "fileUrl" TEXT NOT NULL,
    "fileType" TEXT NOT NULL,
    "message" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "shared_student_files_pkey" PRIMARY KEY ("id")
);

CREATE TABLE IF NOT EXISTS "project_progress_updates" (
    "id" TEXT NOT NULL,
    "projectId" TEXT NOT NULL,
    "studentEmail" TEXT NOT NULL,
    "handlerEmail" TEXT NOT NULL,
    "status" TEXT NOT NULL,
    "progress" INTEGER NOT NULL,
    "title" TEXT NOT NULL,
    "details" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "project_progress_updates_pkey" PRIMARY KEY ("id")
);

ALTER TABLE "shared_student_files"
ADD CONSTRAINT "shared_student_files_projectId_fkey"
FOREIGN KEY ("projectId") REFERENCES "projects"("id") ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "project_progress_updates"
ADD CONSTRAINT "project_progress_updates_projectId_fkey"
FOREIGN KEY ("projectId") REFERENCES "projects"("id") ON DELETE CASCADE ON UPDATE CASCADE;
