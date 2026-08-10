import { prisma } from "./prisma";

/**
 * Checks if a given email belongs to a Project Handler in the system.
 * A Project Handler is identified by:
 * 1. A registered User with role "PROJECT_HANDLER"
 * 2. An active Project Handler invite
 * 3. Any Project where this email is specified as the handler email
 */
export async function isProjectHandlerEmail(email: string): Promise<boolean> {
  if (!email) return false;
  const cleanEmail = email.toLowerCase().trim();

  // 1. Check User table for PROJECT_HANDLER role
  const handlerUser = await prisma.user.findFirst({
    where: {
      email: cleanEmail,
      role: "PROJECT_HANDLER",
    },
  });
  if (handlerUser) return true;

  // 2. Check ProjectHandlerInvite table
  const invite = await prisma.projectHandlerInvite.findFirst({
    where: {
      email: cleanEmail,
    },
  });
  if (invite) return true;

  // 3. Check Project table for handlerEmail
  const projectHandler = await prisma.project.findFirst({
    where: {
      handlerEmail: cleanEmail,
    },
  });
  if (projectHandler) return true;

  return false;
}
