import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

async function handlerCanAccessMeeting(handlerEmail: string, meetingId: string) {
  const meeting = await prisma.meeting.findUnique({
    where: { id: meetingId },
    select: { studentEmail: true }
  });

  if (!meeting) return false;

  const project = await prisma.project.findFirst({
    where: {
      handlerEmail,
      studentEmail: meeting.studentEmail
    },
    select: { id: true }
  });

  return Boolean(project);
}

export async function PUT(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const session = await getServerSession(authOptions);
    if (!session?.user?.id || (session.user.role !== "ADMIN" && session.user.role !== "PROJECT_HANDLER")) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    if (session.user.role === "PROJECT_HANDLER" && !(await handlerCanAccessMeeting(session.user.email, id))) {
      return NextResponse.json({ error: "Meeting is not assigned to this project handler" }, { status: 403 });
    }

    const body = await request.json();
    const { title, date, time, meetLink } = body;

    const meeting = await prisma.meeting.update({
      where: { id },
      data: {
        title: title || undefined,
        date: date ? new Date(date) : undefined,
        time: time || undefined,
        meetLink: meetLink || undefined
      }
    });

    return NextResponse.json(meeting);
  } catch (error) {
    console.error("PUT meeting error:", error);
    return NextResponse.json({ error: "Failed to update meeting" }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const session = await getServerSession(authOptions);
    if (!session?.user?.id || (session.user.role !== "ADMIN" && session.user.role !== "PROJECT_HANDLER")) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    if (session.user.role === "PROJECT_HANDLER" && !(await handlerCanAccessMeeting(session.user.email, id))) {
      return NextResponse.json({ error: "Meeting is not assigned to this project handler" }, { status: 403 });
    }

    await prisma.meeting.delete({
      where: { id }
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("DELETE meeting error:", error);
    return NextResponse.json({ error: "Failed to delete meeting" }, { status: 500 });
  }
}
