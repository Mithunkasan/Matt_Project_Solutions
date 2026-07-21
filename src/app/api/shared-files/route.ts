import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { getFileType, uploadToCloudinary } from "@/lib/cloudinary";

async function getAssignedProject(projectId: string, handlerEmail: string) {
  return prisma.project.findFirst({
    where: {
      id: projectId,
      handlerEmail,
      studentEmail: { not: null }
    },
    select: {
      id: true,
      name: true,
      studentEmail: true
    }
  });
}

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    let where = {};
    if (session.user.role === "PROJECT_HANDLER") {
      where = { handlerEmail: session.user.email };
    } else if (session.user.role !== "ADMIN") {
      where = { studentEmail: session.user.email };
    }

    const files = await prisma.sharedStudentFile.findMany({
      where,
      include: {
        project: {
          select: {
            name: true,
            student: true,
            handler: true
          }
        }
      },
      orderBy: { createdAt: "desc" }
    });

    return NextResponse.json(files);
  } catch (error) {
    console.error("GET shared files error:", error);
    return NextResponse.json({ error: "Failed to fetch shared files" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email || session.user.role !== "PROJECT_HANDLER") {
      return NextResponse.json({ error: "Only project handlers can share files" }, { status: 401 });
    }

    const formData = await request.formData();
    const projectId = (formData.get("projectId") as string) || "";
    const message = ((formData.get("message") as string) || "").trim();
    const file = formData.get("file") as File;

    if (!projectId || !file) {
      return NextResponse.json({ error: "Project and file are required" }, { status: 400 });
    }

    const project = await getAssignedProject(projectId, session.user.email);
    if (!project?.studentEmail) {
      return NextResponse.json({ error: "Project is not assigned to this handler" }, { status: 403 });
    }

    const upload = await uploadToCloudinary(file, "handler-files");
    const fileType = getFileType(file);

    const sharedFile = await prisma.sharedStudentFile.create({
      data: {
        projectId: project.id,
        studentEmail: project.studentEmail,
        handlerEmail: session.user.email,
        fileName: file.name,
        fileUrl: upload.secure_url,
        fileType,
        message: message || null
      },
      include: {
        project: {
          select: {
            name: true,
            student: true,
            handler: true
          }
        }
      }
    });

    await prisma.notification.create({
      data: {
        studentEmail: project.studentEmail,
        title: "New File Shared",
        message: `A project handler shared ${file.name} for ${project.name}.${message ? ` ${message}` : ""}`,
        type: "FILE"
      }
    });

    return NextResponse.json(sharedFile, { status: 201 });
  } catch (error) {
    console.error("POST shared file error:", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to share file" },
      { status: 500 }
    );
  }
}
