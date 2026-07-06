import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import fs from "fs/promises";
import path from "path";

export async function DELETE(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const session = await getServerSession(authOptions);
    if (!session?.user?.id || session.user.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const projectFile = await prisma.projectFile.findUnique({
      where: { id }
    });

    if (!projectFile) {
      return NextResponse.json({ error: "File not found" }, { status: 404 });
    }

    // Try deleting physical file from disk
    try {
      const filePath = path.join(process.cwd(), "public", projectFile.fileUrl);
      await fs.unlink(filePath);
    } catch (err) {
      console.warn("Could not delete old file:", err);
    }

    await prisma.projectFile.delete({
      where: { id }
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("DELETE file error:", error);
    return NextResponse.json({ error: "Failed to delete file" }, { status: 500 });
  }
}
