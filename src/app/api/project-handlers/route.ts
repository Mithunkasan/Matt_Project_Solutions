import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email || session.user.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const userHandlers = await prisma.user.findMany({
      where: { role: "PROJECT_HANDLER" },
      select: { name: true, email: true },
      orderBy: { name: "asc" }
    });

    const projectHandlers = await prisma.project.findMany({
      where: { handlerEmail: { not: null } },
      select: { handler: true, handlerEmail: true },
      distinct: ["handlerEmail"],
      orderBy: { handler: "asc" }
    });

    const handlers = new Map<string, { name: string; email: string }>();

    projectHandlers.forEach((handler) => {
      if (handler.handlerEmail) {
        handlers.set(handler.handlerEmail, {
          email: handler.handlerEmail,
          name: handler.handler
        });
      }
    });

    userHandlers.forEach((handler) => {
      handlers.set(handler.email, {
        email: handler.email,
        name: handler.name
      });
    });

    return NextResponse.json(Array.from(handlers.values()));
  } catch (error) {
    console.error("GET project handlers error:", error);
    return NextResponse.json({ error: "Failed to fetch project handlers" }, { status: 500 });
  }
}
