// src/app/api/landing/offers/route.ts
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

// Default initial offers to show if DB is empty
const DEFAULT_OFFERS = [
  { text: "WELCOME TO MATT PROJECT SOLUTIONS - ACADEMIC PROJECTS & INTERNSHIPS ENROLLMENT OPEN", link: "/browse?tab=projects" },
  { text: "SPECIAL OFFER: 20% DISCOUNT ON ALL IEEE 2026 CLOUD COMPUTING PROJECTS", link: "/courses" },
  { text: "NEW BATCH FOR PYTHON FULL-STACK WEB DEVELOPMENT STARTS SOON - ENROLL NOW!", link: "/courses" },
];

export async function GET() {
  try {
    let offers = await prisma.offer.findMany({
      orderBy: { createdAt: "desc" },
    });

    // Fallback to defaults if no offers exist in database
    if (offers.length === 0) {
      offers = DEFAULT_OFFERS.map((off, idx) => ({
        id: `default-offer-${idx}`,
        text: off.text,
        link: off.link,
        createdAt: new Date(),
        updatedAt: new Date(),
      }));
    }

    return NextResponse.json(offers);
  } catch (error) {
    console.error("Fetch offers error:", error);
    return NextResponse.json({ error: "Failed to fetch offers" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || session.user.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { text, link } = await request.json();
    if (!text) {
      return NextResponse.json({ error: "Offer text is required" }, { status: 400 });
    }

    const offer = await prisma.offer.create({
      data: {
        text,
        link: link || "",
      },
    });

    return NextResponse.json(offer, { status: 201 });
  } catch (error) {
    console.error("Create offer error:", error);
    return NextResponse.json({ error: "Failed to create offer" }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || session.user.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id, text, link } = await request.json();
    if (!id || !text) {
      return NextResponse.json({ error: "ID and text are required" }, { status: 400 });
    }

    // Check if modifying a default ID placeholder (in which case, create a new database record instead)
    if (id.startsWith("default-offer-")) {
      const offer = await prisma.offer.create({
        data: {
          text,
          link: link || "",
        },
      });
      return NextResponse.json(offer);
    }

    const offer = await prisma.offer.update({
      where: { id },
      data: {
        text,
        link: link || "",
      },
    });

    return NextResponse.json(offer);
  } catch (error) {
    console.error("Update offer error:", error);
    return NextResponse.json({ error: "Failed to update offer" }, { status: 500 });
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
    if (id.startsWith("default-offer-")) {
      return NextResponse.json({ success: true, message: "Default offer removed" });
    }

    await prisma.offer.delete({
      where: { id },
    });

    return NextResponse.json({ success: true, message: "Offer deleted successfully" });
  } catch (error) {
    console.error("Delete offer error:", error);
    return NextResponse.json({ error: "Failed to delete offer" }, { status: 500 });
  }
}
