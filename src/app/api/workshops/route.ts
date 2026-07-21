import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

function buildWorkshopData(body: Record<string, unknown>) {
  const date = body.date ? new Date(String(body.date)) : null;

  if (!date || Number.isNaN(date.getTime())) {
    throw new Error("Valid date is required");
  }

  const required = ["time", "handlerEmail", "handlerName", "participantNames", "college", "department", "topic", "duration"];
  const missing = required.filter((field) => !String(body[field] || "").trim());

  if (missing.length > 0) {
    throw new Error(`Missing required fields: ${missing.join(", ")}`);
  }

  return {
    date,
    time: String(body.time).trim(),
    handlerEmail: String(body.handlerEmail).toLowerCase().trim(),
    handlerName: String(body.handlerName).trim(),
    participantNames: String(body.participantNames).trim(),
    college: String(body.college).trim(),
    department: String(body.department).trim(),
    topic: String(body.topic).trim(),
    duration: String(body.duration).trim()
  };
}

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    if (session.user.role !== "ADMIN" && session.user.role !== "PROJECT_HANDLER") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const workshops = await prisma.handlerWorkshop.findMany({
      where: session.user.role === "PROJECT_HANDLER" ? { handlerEmail: session.user.email } : {},
      orderBy: [{ date: "desc" }, { createdAt: "desc" }]
    });

    return NextResponse.json(workshops);
  } catch (error) {
    console.error("GET workshops error:", error);
    return NextResponse.json({ error: "Failed to fetch workshops" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email || session.user.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const data = buildWorkshopData(await request.json());
    const workshop = await prisma.handlerWorkshop.create({ data });

    return NextResponse.json(workshop, { status: 201 });
  } catch (error) {
    console.error("POST workshop error:", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to create workshop" },
      { status: 400 }
    );
  }
}

export async function PUT(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email || session.user.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const id = String(body.id || "");

    if (!id) {
      return NextResponse.json({ error: "Workshop id is required" }, { status: 400 });
    }

    const data = buildWorkshopData(body);
    const workshop = await prisma.handlerWorkshop.update({
      where: { id },
      data
    });

    return NextResponse.json(workshop);
  } catch (error) {
    console.error("PUT workshop error:", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to update workshop" },
      { status: 400 }
    );
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email || session.user.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const id = request.nextUrl.searchParams.get("id");

    if (!id) {
      return NextResponse.json({ error: "Workshop id is required" }, { status: 400 });
    }

    await prisma.handlerWorkshop.delete({ where: { id } });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("DELETE workshop error:", error);
    return NextResponse.json({ error: "Failed to delete workshop" }, { status: 500 });
  }
}
