import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id || session.user.role !== "PROJECT_HANDLER") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: { id: true, name: true, email: true, mobileNumber: true }
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    return NextResponse.json(user);
  } catch (error) {
    console.error("GET project-handler profile error:", error);
    return NextResponse.json({ error: "Failed to fetch profile" }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id || session.user.role !== "PROJECT_HANDLER") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { mobileNumber } = await request.json();

    if (!mobileNumber) {
      return NextResponse.json({ error: "Mobile number is required" }, { status: 400 });
    }

    const updatedUser = await prisma.user.update({
      where: { id: session.user.id },
      data: { mobileNumber: String(mobileNumber).trim() },
      select: { id: true, name: true, email: true, mobileNumber: true }
    });

    return NextResponse.json(updatedUser);
  } catch (error) {
    console.error("PUT project-handler profile error:", error);
    return NextResponse.json({ error: "Failed to update profile" }, { status: 500 });
  }
}
