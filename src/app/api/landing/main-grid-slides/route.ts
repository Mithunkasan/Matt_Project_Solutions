import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { DEFAULT_MAIN_GRID_SLIDES } from "@/lib/landingDefaults";
import fs from "fs/promises";
import path from "path";

export async function GET() {
  try {
    let slides = await prisma.mainGridSlide.findMany({
      orderBy: [{ sortOrder: "asc" }, { createdAt: "asc" }],
    });

    if (slides.length === 0) {
      slides = DEFAULT_MAIN_GRID_SLIDES.map((slide, idx) => ({
        id: `default-slide-${idx}`,
        ...slide,
        createdAt: new Date(),
        updatedAt: new Date(),
      }));
    }

    return NextResponse.json(slides);
  } catch (error) {
    console.error("Fetch main grid slides error:", error);
    return NextResponse.json({ error: "Failed to fetch main grid slides" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || session.user.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { title, imageUrl, description, badge, sortOrder } = await request.json();
    if (!title || !imageUrl || !description) {
      return NextResponse.json({ error: "Title, image URL, and description are required" }, { status: 400 });
    }

    const slide = await prisma.mainGridSlide.create({
      data: {
        title,
        imageUrl,
        description,
        badge: badge || "Student Spotlight",
        sortOrder: Number.isFinite(Number(sortOrder)) ? Number(sortOrder) : 0,
      },
    });

    return NextResponse.json(slide, { status: 201 });
  } catch (error) {
    console.error("Create main grid slide error:", error);
    return NextResponse.json({ error: "Failed to create main grid slide" }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || session.user.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id, title, imageUrl, description, badge, sortOrder } = await request.json();
    if (!id || !title || !imageUrl || !description) {
      return NextResponse.json({ error: "ID, title, image URL, and description are required" }, { status: 400 });
    }

    const data = {
      title,
      imageUrl,
      description,
      badge: badge || "Student Spotlight",
      sortOrder: Number.isFinite(Number(sortOrder)) ? Number(sortOrder) : 0,
    };

    if (id.startsWith("default-slide-")) {
      const slide = await prisma.mainGridSlide.create({ data });
      return NextResponse.json(slide);
    }

    // Retrieve old slide to check for image deletion
    const existingSlide = await prisma.mainGridSlide.findUnique({
      where: { id },
      select: { imageUrl: true }
    });

    if (existingSlide && existingSlide.imageUrl !== imageUrl && existingSlide.imageUrl.startsWith("/uploads/")) {
      try {
        const oldPath = path.join(process.cwd(), "public", existingSlide.imageUrl);
        await fs.unlink(oldPath);
      } catch (err) {
        console.warn("Could not delete old slide image:", err);
      }
    }

    const slide = await prisma.mainGridSlide.update({
      where: { id },
      data,
    });

    return NextResponse.json(slide);
  } catch (error) {
    console.error("Update main grid slide error:", error);
    return NextResponse.json({ error: "Failed to update main grid slide" }, { status: 500 });
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

    if (id.startsWith("default-slide-")) {
      return NextResponse.json({ success: true, message: "Default slide removed" });
    }

    // Retrieve slide to check for image deletion
    const existingSlide = await prisma.mainGridSlide.findUnique({
      where: { id },
      select: { imageUrl: true }
    });

    if (existingSlide && existingSlide.imageUrl.startsWith("/uploads/")) {
      try {
        const oldPath = path.join(process.cwd(), "public", existingSlide.imageUrl);
        await fs.unlink(oldPath);
      } catch (err) {
        console.warn("Could not delete slide image on delete:", err);
      }
    }

    await prisma.mainGridSlide.delete({ where: { id } });

    return NextResponse.json({ success: true, message: "Main grid slide deleted successfully" });
  } catch (error) {
    console.error("Delete main grid slide error:", error);
    return NextResponse.json({ error: "Failed to delete main grid slide" }, { status: 500 });
  }
}
