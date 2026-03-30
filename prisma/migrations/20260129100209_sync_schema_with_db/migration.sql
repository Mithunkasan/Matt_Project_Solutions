-- CreateEnum
CREATE TYPE "Role" AS ENUM ('ADMIN', 'STUDENT');

-- AlterTable
ALTER TABLE "class_schedules" ADD COLUMN     "studentEmail" TEXT;

-- AlterTable
ALTER TABLE "projects" ADD COLUMN     "studentEmail" TEXT;

-- AlterTable
ALTER TABLE "users" ADD COLUMN     "role" "Role" NOT NULL DEFAULT 'STUDENT';
