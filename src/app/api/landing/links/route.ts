// src/app/api/landing/links/route.ts
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

// Default initial links to show if DB is empty
const DEFAULT_LINKS = [
  { title: "IEEE Project Topics", url: "#" },
  { title: "Course Curriculum", url: "#" },
  { title: "Internship Guidelines", url: "#" },
  { title: "Academic Project Calendar", url: "#" },
  { title: "Lab Batch Timings", url: "#" },
];

export async function GET() {
  try {
    let links = await prisma.importantLink.findMany({
      orderBy: { createdAt: "asc" },
    });

    // Fallback to defaults if no links exist
    if (links.length === 0) {
      links = DEFAULT_LINKS.map((link, idx) => ({
        id: `default-${idx}`,
        title: link.title,
        url: link.url,
        createdAt: new Date(),
        updatedAt: new Date(),
      }));
    }

    return NextResponse.json(links);
  } catch (error) {
    console.error("Fetch links error:", error);
    return NextResponse.json({ error: "Failed to fetch links" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || session.user.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { title, url } = await request.json();
    if (!title || !url) {
      return NextResponse.json({ error: "Title and URL are required" }, { status: 400 });
    }

    const link = await prisma.importantLink.create({
      data: { title, url },
    });

    return NextResponse.json(link, { status: 201 });
  } catch (error) {
    console.error("Create link error:", error);
    return NextResponse.json({ error: "Failed to create link" }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || session.user.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id, title, url } = await request.json();
    if (!id || !title || !url) {
      return NextResponse.json({ error: "ID, Title, and URL are required" }, { status: 400 });
    }

    // Check if modifying a default ID placeholder (in which case, create a new database record instead)
    if (id.startsWith("default-")) {
      const link = await prisma.importantLink.create({
        data: { title, url },
      });
      return NextResponse.json(link);
    }

    const link = await prisma.importantLink.update({
      where: { id },
      data: { title, url },
    });

    return NextResponse.json(link);
  } catch (error) {
    console.error("Update link error:", error);
    return NextResponse.json({ error: "Failed to update link" }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || session.user.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json({ error: "ID is required" }, { status: 400 });
    }

    // If it's a default link, we don't delete from DB but succeed
    if (id.startsWith("default-")) {
      return NextResponse.json({ success: true, message: "Default link removed" });
    }

    await prisma.importantLink.delete({
      where: { id },
    });

    return NextResponse.json({ success: true, message: "Link deleted successfully" });
  } catch (error) {
    console.error("Delete link error:", error);
    return NextResponse.json({ error: "Failed to delete link" }, { status: 500 });
  }
}
