// src/app/api/landing/announcements/route.ts
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

// Default initial announcements to show if DB is empty
const DEFAULT_ANNOUNCEMENTS = [
  { month: "JUL", day: "2", title: "2026 IEEE PROJECT DOMAINS RELEASED (Cloud Computing, AI, ML, IoT)", href: "/browse?tab=projects" },
  { month: "JUL", day: "1", title: "PYTHON FULL-STACK WEB DEVELOPMENT BATCH STARTING (July 15)", href: "/browse?tab=classes" },
  { month: "JUN", day: "28", title: "INTERNSHIP PROGRAM ENROLLMENT OPEN (Summer / Winter 2026)", href: "/browse?tab=classes" },
  { month: "JUN", day: "25", title: "ACADEMIC PROJECT PLACEMENT & REVIEWS (Group Guidance)", href: "/browse?tab=classes" },
];

export async function GET() {
  try {
    let announcements = await prisma.announcement.findMany({
      orderBy: { createdAt: "desc" },
    });

    // Fallback to defaults if no announcements exist
    if (announcements.length === 0) {
      announcements = DEFAULT_ANNOUNCEMENTS.map((ann, idx) => ({
        id: `default-${idx}`,
        title: ann.title,
        month: ann.month,
        day: ann.day,
        href: ann.href,
        createdAt: new Date(),
        updatedAt: new Date(),
      }));
    }

    return NextResponse.json(announcements);
  } catch (error) {
    console.error("Fetch announcements error:", error);
    return NextResponse.json({ error: "Failed to fetch announcements" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || session.user.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { title, month, day, href } = await request.json();
    if (!title || !month || !day) {
      return NextResponse.json({ error: "Title, month, and day are required" }, { status: 400 });
    }

    const announcement = await prisma.announcement.create({
      data: {
        title,
        month: month.toUpperCase(),
        day,
        href: href || "/browse",
      },
    });

    return NextResponse.json(announcement, { status: 201 });
  } catch (error) {
    console.error("Create announcement error:", error);
    return NextResponse.json({ error: "Failed to create announcement" }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || session.user.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id, title, month, day, href } = await request.json();
    if (!id || !title || !month || !day) {
      return NextResponse.json({ error: "ID, Title, month, and day are required" }, { status: 400 });
    }

    // Check if modifying a default ID placeholder (in which case, create a new database record instead)
    if (id.startsWith("default-")) {
      const announcement = await prisma.announcement.create({
        data: {
          title,
          month: month.toUpperCase(),
          day,
          href: href || "/browse",
        },
      });
      return NextResponse.json(announcement);
    }

    const announcement = await prisma.announcement.update({
      where: { id },
      data: {
        title,
        month: month.toUpperCase(),
        day,
        href: href || "/browse",
      },
    });

    return NextResponse.json(announcement);
  } catch (error) {
    console.error("Update announcement error:", error);
    return NextResponse.json({ error: "Failed to update announcement" }, { status: 500 });
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

    // If it's a default placeholder, don't delete from DB but succeed
    if (id.startsWith("default-")) {
      return NextResponse.json({ success: true, message: "Default announcement removed" });
    }

    await prisma.announcement.delete({
      where: { id },
    });

    return NextResponse.json({ success: true, message: "Announcement deleted successfully" });
  } catch (error) {
    console.error("Delete announcement error:", error);
    return NextResponse.json({ error: "Failed to delete announcement" }, { status: 500 });
  }
}
