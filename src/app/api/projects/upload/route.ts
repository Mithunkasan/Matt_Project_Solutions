import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import fs from "fs/promises";
import path from "path";

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id || session.user.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const formData = await request.formData();
    const file = formData.get("file") as File;
    const projectId = formData.get("projectId") as string;
    const documentName = formData.get("documentName") as string; // Proposal, Synopsis, etc.

    if (!file || !projectId || !documentName) {
      return NextResponse.json({ error: "Missing file, project ID, or document name" }, { status: 400 });
    }

    // Read file contents
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Create unique file name
    const timestamp = Date.now();
    const cleanFileName = `${timestamp}_${file.name.replace(/\s+/g, "_")}`;
    
    // Set upload directory to public/uploads
    const uploadDir = path.join(process.cwd(), "public", "uploads");
    
    // Ensure upload directory exists
    await fs.mkdir(uploadDir, { recursive: true });
    
    const filePath = path.join(uploadDir, cleanFileName);
    
    // Write file to disk
    await fs.writeFile(filePath, buffer);
    
    const fileUrl = `/uploads/${cleanFileName}`;

    // Upsert or create project file record
    // If a document of this type already exists for the project, we can replace it!
    const existingFile = await prisma.projectFile.findFirst({
      where: {
        projectId,
        name: documentName
      }
    });

    if (existingFile) {
      // Try to delete the physical old file
      try {
        const oldPath = path.join(process.cwd(), "public", existingFile.fileUrl);
        await fs.unlink(oldPath);
      } catch (err) {
        console.warn("Could not delete old file:", err);
      }

      const updated = await prisma.projectFile.update({
        where: { id: existingFile.id },
        data: {
          fileName: file.name,
          fileUrl
        }
      });
      return NextResponse.json(updated);
    }

    const projectFile = await prisma.projectFile.create({
      data: {
        projectId,
        name: documentName,
        fileName: file.name,
        fileUrl
      }
    });

    // Also send an in-app notification to the student assigned to this project
    const project = await prisma.project.findUnique({
      where: { id: projectId }
    });

    if (project?.studentEmail) {
      await prisma.notification.create({
        data: {
          studentEmail: project.studentEmail,
          title: "New Project File Uploaded",
          message: `The admin has uploaded the document: ${documentName} (${file.name}). You can now download it from your dashboard.`,
          type: "FILE"
        }
      });
    }

    return NextResponse.json(projectFile);
  } catch (error) {
    console.error("File upload error:", error);
    return NextResponse.json({ error: "Failed to upload file" }, { status: 500 });
  }
}
