import { NextResponse, NextRequest } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { sendProjectHandlerInviteEmail } from "@/lib/nodemailer";
import crypto from "crypto";

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

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email || session.user.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { email, name } = await request.json();

    if (!email) {
      return NextResponse.json({ error: "Email is required" }, { status: 400 });
    }

    const cleanEmail = String(email).toLowerCase().trim();
    const cleanName = name ? String(name).trim() : cleanEmail.split("@")[0];

    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email: cleanEmail }
    });

    if (existingUser) {
      return NextResponse.json({ error: "A user with this email address already exists" }, { status: 400 });
    }

    // Check if an invite has already been sent
    const existingInvite = await prisma.projectHandlerInvite.findFirst({
      where: { email: cleanEmail }
    });

    if (existingInvite) {
      return NextResponse.json({ error: "A password setup link has already been sent to this email address" }, { status: 400 });
    }

    // Generate token
    const token = crypto.randomBytes(32).toString("hex");
    await prisma.projectHandlerInvite.create({
      data: {
        email: cleanEmail,
        name: cleanName,
        token,
        expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
      }
    });

    const origin = process.env.NEXTAUTH_URL || "https://matt-projects-dashboard-3jae.vercel.app";
    const inviteLink = `${origin}/project-handler/invite?token=${token}`;

    try {
      const emailResult = await sendProjectHandlerInviteEmail(cleanEmail, cleanName, inviteLink);
      if (!emailResult.success) {
        // Rollback DB invite on email fail so admin can retry
        await prisma.projectHandlerInvite.delete({
          where: { token }
        });
        return NextResponse.json({ error: `Failed to send email: ${emailResult.error}` }, { status: 500 });
      }
    } catch (emailErr: unknown) {
      await prisma.projectHandlerInvite.delete({
        where: { token }
      });
      const emailErrorMessage = emailErr instanceof Error ? emailErr.message : "Unknown error";
      return NextResponse.json({ error: `Failed to send email: ${emailErrorMessage}` }, { status: 500 });
    }

    return NextResponse.json({ success: true });
  } catch (error: unknown) {
    console.error("POST project-handlers invite error:", error);
    const errorMessage = error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json({ error: "Failed to send password setup email", details: errorMessage }, { status: 500 });
  }
}
