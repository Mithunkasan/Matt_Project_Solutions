import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

async function getAssignedStudentEmails(handlerEmail: string) {
  const projects = await prisma.project.findMany({
    where: { handlerEmail, studentEmail: { not: null } },
    select: { studentEmail: true }
  });
  return projects.map(project => project.studentEmail).filter((email): email is string => Boolean(email));
}

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    if (session.user.role === "ADMIN") {
      const meetings = await prisma.meeting.findMany({
        orderBy: { date: "asc" }
      });
      return NextResponse.json(meetings);
    } else if (session.user.role === "PROJECT_HANDLER") {
      const studentEmails = await getAssignedStudentEmails(session.user.email);
      const meetings = await prisma.meeting.findMany({
        where: { studentEmail: { in: studentEmails } },
        orderBy: { date: "asc" }
      });
      return NextResponse.json(meetings);
    } else {
      const meetings = await prisma.meeting.findMany({
        where: { studentEmail: session.user.email },
        orderBy: { date: "asc" }
      });
      return NextResponse.json(meetings);
    }
  } catch (error) {
    console.error("GET meetings error:", error);
    return NextResponse.json({ error: "Failed to fetch meetings" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id || (session.user.role !== "ADMIN" && session.user.role !== "PROJECT_HANDLER")) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { studentEmail, title, date, time, meetLink, type } = body;

    const cleanStudentEmail = studentEmail?.toLowerCase().trim();

    if (!cleanStudentEmail || !title || !date || !time || !meetLink || !type) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    if (session.user.role === "PROJECT_HANDLER") {
      const studentEmails = await getAssignedStudentEmails(session.user.email);
      if (!studentEmails.includes(cleanStudentEmail)) {
        return NextResponse.json({ error: "Student is not assigned to this project handler" }, { status: 403 });
      }
    }

    const meeting = await prisma.meeting.create({
      data: {
        studentEmail: cleanStudentEmail,
        title,
        date: new Date(date),
        time,
        meetLink,
        type // PROJECT or COURSE
      }
    });

    // Send an in-app notification to the student
    await prisma.notification.create({
      data: {
        studentEmail: cleanStudentEmail,
        title: "New Meeting Scheduled",
        message: `A meeting titled "${title}" has been scheduled for ${date} at ${time}. Join link: ${meetLink}`,
        type: "MEETING"
      }
    });

    return NextResponse.json(meeting, { status: 201 });
  } catch (error) {
    console.error("POST meeting error:", error);
    return NextResponse.json({ error: "Failed to create meeting" }, { status: 500 });
  }
}
