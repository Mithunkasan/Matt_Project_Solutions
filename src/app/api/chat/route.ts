import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import fs from "fs/promises";
import path from "path";

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const mode = searchParams.get("mode"); // "threads" or "messages"
    const studentEmailParam = searchParams.get("studentEmail");

    if (session.user.role === "ADMIN") {
      if (mode === "threads") {
        // Fetch unique student emails from messages
        const threads = await prisma.chatMessage.groupBy({
          by: ["studentEmail"],
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
        const allStudents = await prisma.user.findMany({
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
        return NextResponse.json({ error: "studentEmail is required for Admin" }, { status: 400 });
      }

      const messages = await prisma.chatMessage.findMany({
        where: { studentEmail: studentEmailParam.toLowerCase().trim() },
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
      studentEmail = session.user.role === "ADMIN" ? emailParam : session.user.email;
      
      const file = formData.get("file") as File;
      if (file) {
        const bytes = await file.arrayBuffer();
        const buffer = Buffer.from(bytes);
        const timestamp = Date.now();
        const cleanFileName = `${timestamp}_${file.name.replace(/\s+/g, "_")}`;
        const uploadDir = path.join(process.cwd(), "public", "uploads", "chat");
        
        await fs.mkdir(uploadDir, { recursive: true });
        const filePath = path.join(uploadDir, cleanFileName);
        await fs.writeFile(filePath, buffer);
        
        fileUrl = `/uploads/chat/${cleanFileName}`;
        fileName = file.name;
        
        if (file.type.startsWith("image/")) {
          fileType = "image";
        } else if (file.type.startsWith("audio/")) {
          fileType = "audio";
        } else {
          fileType = "document";
        }
      }
    } else {
      const body = await request.json();
      messageText = body.message || "";
      studentEmail = session.user.role === "ADMIN" ? body.studentEmail : session.user.email;
    }

    if (!studentEmail) {
      return NextResponse.json({ error: "Student email is required" }, { status: 400 });
    }

    if (!messageText && !fileUrl) {
      return NextResponse.json({ error: "Message or file attachment is required" }, { status: 400 });
    }

    const cleanEmail = studentEmail.toLowerCase().trim();
    const role = session.user.role as "ADMIN" | "STUDENT"; // ADMIN or STUDENT

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
