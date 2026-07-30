import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
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

    if (!file) {
      return NextResponse.json({ error: "Missing file" }, { status: 400 });
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

    return NextResponse.json({ fileUrl });
  } catch (error: unknown) {
    console.error("Main grid slide file upload error:", error);
    const errorMessage = error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json({ error: "Failed to upload file", details: errorMessage }, { status: 500 });
  }
}
