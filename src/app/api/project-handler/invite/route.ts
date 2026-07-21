import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";

export async function GET(request: NextRequest) {
  const token = request.nextUrl.searchParams.get("token");

  if (!token) {
    return NextResponse.json({ error: "Invite token is required" }, { status: 400 });
  }

  const invite = await prisma.projectHandlerInvite.findUnique({
    where: { token },
    select: { email: true, name: true, expiresAt: true, usedAt: true }
  });

  if (!invite || invite.usedAt || invite.expiresAt < new Date()) {
    return NextResponse.json({ error: "This invitation link is invalid or expired" }, { status: 400 });
  }

  return NextResponse.json({ email: invite.email, name: invite.name });
}

export async function POST(request: NextRequest) {
  try {
    const { token, password, confirmPassword } = await request.json();

    if (!token || !password || !confirmPassword) {
      return NextResponse.json({ error: "All fields are required" }, { status: 400 });
    }

    if (password !== confirmPassword) {
      return NextResponse.json({ error: "Passwords do not match" }, { status: 400 });
    }

    if (password.length < 8) {
      return NextResponse.json({ error: "Password must be at least 8 characters" }, { status: 400 });
    }

    const invite = await prisma.projectHandlerInvite.findUnique({
      where: { token }
    });

    if (!invite || invite.usedAt || invite.expiresAt < new Date()) {
      return NextResponse.json({ error: "This invitation link is invalid or expired" }, { status: 400 });
    }

    const hashedPassword = await bcrypt.hash(password, 12);

    await prisma.$transaction([
      prisma.user.upsert({
        where: { email: invite.email },
        update: {
          name: invite.name,
          password: hashedPassword,
          role: "PROJECT_HANDLER"
        },
        create: {
          email: invite.email,
          name: invite.name,
          password: hashedPassword,
          role: "PROJECT_HANDLER"
        }
      }),
      prisma.projectHandlerInvite.update({
        where: { token },
        data: { usedAt: new Date() }
      })
    ]);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Project handler invite setup error:", error);
    return NextResponse.json({ error: "Failed to set password" }, { status: 500 });
  }
}
