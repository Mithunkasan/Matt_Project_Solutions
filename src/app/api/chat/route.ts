import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { getFileType, uploadToCloudinary } from "@/lib/cloudinary";

async function getAssignedStudents(handlerEmail: string) {
  const projects = await prisma.project.findMany({
    where: { handlerEmail, studentEmail: { not: null } },
    select: { studentEmail: true, student: true }
  });

  const seen = new Set<string>();
  return projects
    .map(project => ({
      email: project.studentEmail?.toLowerCase().trim(),
      name: project.student
    }))
    .filter((student): student is { email: string; name: string } => {
      if (!student.email || seen.has(student.email)) return false;
      seen.add(student.email);
      return true;
    });
}

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const mode = searchParams.get("mode"); // "threads" or "messages"
    const studentEmailParam = searchParams.get("studentEmail");

    if (session.user.role === "ADMIN" || session.user.role === "PROJECT_HANDLER") {
      const isHandler = session.user.role === "PROJECT_HANDLER";
      const assignedStudents = isHandler ? await getAssignedStudents(session.user.email) : [];
      const assignedEmails = assignedStudents.map(student => student.email);

      if (mode === "threads") {
        // Fetch unique student emails from messages
        const threads = await prisma.chatMessage.groupBy({
          by: ["studentEmail"],
          where: isHandler ? { studentEmail: { in: assignedEmails } } : undefined,
          _max: {
            createdAt: true
          }
        });
        
        // Fetch student names for these emails from User table
        const emails = threads.map(t => t.studentEmail);
        const users = await prisma.user.findMany({
          where: {
            email: { in: emails }
          },
          select: {
            email: true,
            name: true
          }
        });

        const threadList = threads.map(t => {
          const user = users.find(u => u.email === t.studentEmail);
          return {
            studentEmail: t.studentEmail,
            studentName: user?.name || "Registered Student",
            lastMessageAt: t._max.createdAt || new Date(0)
          };
        });

        // Also add other registered students who don't have messages yet
        const allStudents = isHandler
          ? assignedStudents.map(student => ({ email: student.email, name: student.name }))
          : await prisma.user.findMany({
              where: { role: "STUDENT" },
              select: { email: true, name: true }
            });

        allStudents.forEach(student => {
          if (!threadList.some(t => t.studentEmail === student.email)) {
            threadList.push({
              studentEmail: student.email,
              studentName: student.name,
              lastMessageAt: new Date(0) // Default old date
            });
          }
        });

        // Sort threads by last message date desc
        threadList.sort((a, b) => b.lastMessageAt.getTime() - a.lastMessageAt.getTime());

        return NextResponse.json(threadList);
      }

      if (!studentEmailParam) {
        return NextResponse.json({ error: "studentEmail is required" }, { status: 400 });
      }

      const cleanStudentEmailParam = studentEmailParam.toLowerCase().trim();
      if (isHandler && !assignedEmails.includes(cleanStudentEmailParam)) {
        return NextResponse.json({ error: "Student is not assigned to this project handler" }, { status: 403 });
      }

      const messages = await prisma.chatMessage.findMany({
        where: { studentEmail: cleanStudentEmailParam },
        orderBy: { createdAt: "asc" }
      });
      return NextResponse.json(messages);
    } else {
      // Student mode
      const messages = await prisma.chatMessage.findMany({
        where: { studentEmail: session.user.email },
        orderBy: { createdAt: "asc" }
      });
      return NextResponse.json(messages);
    }
  } catch (error) {
    console.error("GET chat error:", error);
    return NextResponse.json({ error: "Failed to fetch chat logs" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const contentType = request.headers.get("content-type") || "";
    let studentEmail = "";
    let messageText = "";
    let fileUrl: string | null = null;
    let fileName: string | null = null;
    let fileType: string | null = null;

    if (contentType.includes("multipart/form-data")) {
      const formData = await request.formData();
      messageText = (formData.get("message") as string) || "";
      const emailParam = formData.get("studentEmail") as string;
      studentEmail = session.user.role === "ADMIN" || session.user.role === "PROJECT_HANDLER" ? emailParam : session.user.email;
      
      const file = formData.get("file") as File;
      if (file) {
        const upload = await uploadToCloudinary(file, "chat");
        fileUrl = upload.secure_url;
        fileName = file.name;
        fileType = getFileType(file);
      }
    } else {
      const body = await request.json();
      messageText = body.message || "";
      studentEmail = session.user.role === "ADMIN" || session.user.role === "PROJECT_HANDLER" ? body.studentEmail : session.user.email;
    }

    if (!studentEmail) {
      return NextResponse.json({ error: "Student email is required" }, { status: 400 });
    }

    if (!messageText && !fileUrl) {
      return NextResponse.json({ error: "Message or file attachment is required" }, { status: 400 });
    }

    const cleanEmail = studentEmail.toLowerCase().trim();

    if (session.user.role === "PROJECT_HANDLER") {
      const assignedStudents = await getAssignedStudents(session.user.email);
      if (!assignedStudents.some(student => student.email === cleanEmail)) {
        return NextResponse.json({ error: "Student is not assigned to this project handler" }, { status: 403 });
      }
    }

    const role = session.user.role as "ADMIN" | "PROJECT_HANDLER" | "STUDENT";

    const chatMessage = await prisma.chatMessage.create({
      data: {
        studentEmail: cleanEmail,
        senderRole: role,
        message: messageText,
        fileUrl,
        fileName,
        fileType
      }
    });

    return NextResponse.json(chatMessage, { status: 201 });
  } catch (error) {
    console.error("POST chat error:", error);
    return NextResponse.json({ error: "Failed to send chat message" }, { status: 500 });
  }
}
