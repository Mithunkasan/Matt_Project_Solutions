import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { sendNotificationEmail } from "@/lib/nodemailer";

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
      const notifications = await prisma.notification.findMany({
        orderBy: { createdAt: "desc" }
      });
      return NextResponse.json(notifications);
    } else if (session.user.role === "PROJECT_HANDLER") {
      const studentEmails = await getAssignedStudentEmails(session.user.email);
      const notifications = await prisma.notification.findMany({
        where: {
          studentEmail: { in: studentEmails },
          type: { not: "PAYMENT" }
        },
        orderBy: { createdAt: "desc" }
      });
      return NextResponse.json(notifications);
    } else {
      const notifications = await prisma.notification.findMany({
        where: { studentEmail: session.user.email },
        orderBy: { createdAt: "desc" }
      });
      return NextResponse.json(notifications);
    }
  } catch (error) {
    console.error("GET notifications error:", error);
    return NextResponse.json({ error: "Failed to fetch notifications" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id || (session.user.role !== "ADMIN" && session.user.role !== "PROJECT_HANDLER")) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { studentEmail, title, message, type, sendEmail } = body;

    const cleanStudentEmail = studentEmail?.toLowerCase().trim();

    if (!cleanStudentEmail || !title || !message || !type) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    if (session.user.role === "PROJECT_HANDLER") {
      if (type === "PAYMENT") {
        return NextResponse.json({ error: "Project handlers cannot send payment notifications" }, { status: 403 });
      }

      const studentEmails = await getAssignedStudentEmails(session.user.email);
      if (!studentEmails.includes(cleanStudentEmail)) {
        return NextResponse.json({ error: "Student is not assigned to this project handler" }, { status: 403 });
      }
    }

    const notification = await prisma.notification.create({
      data: {
        studentEmail: cleanStudentEmail,
        title,
        message,
        type // STATUS, PAYMENT, MEETING, VIVA, FILE
      }
    });

    if (sendEmail) {
      // Send email alert asynchronously
      sendNotificationEmail(cleanStudentEmail, title, message)
        .catch(err => console.error("Async email notification error:", err));
    }

    return NextResponse.json(notification, { status: 201 });
  } catch (error) {
    console.error("POST notification error:", error);
    return NextResponse.json({ error: "Failed to create notification" }, { status: 500 });
  }
}
