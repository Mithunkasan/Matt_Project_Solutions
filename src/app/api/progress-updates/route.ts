import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

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

    const updates = await prisma.projectProgressUpdate.findMany({
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

    return NextResponse.json(updates);
  } catch (error) {
    console.error("GET progress updates error:", error);
    return NextResponse.json({ error: "Failed to fetch progress updates" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email || session.user.role !== "PROJECT_HANDLER") {
      return NextResponse.json({ error: "Only project handlers can update progress" }, { status: 401 });
    }

    const body = await request.json();
    const projectId = String(body.projectId || "");
    const status = String(body.status || "").trim();
    const title = String(body.title || "").trim();
    const details = String(body.details || "").trim();
    const progress = Number(body.progress);

    if (!projectId || !status || !title || !details || Number.isNaN(progress)) {
      return NextResponse.json({ error: "Project, status, progress, title, and details are required" }, { status: 400 });
    }

    if (progress < 0 || progress > 100) {
      return NextResponse.json({ error: "Progress must be between 0 and 100" }, { status: 400 });
    }

    const project = await getAssignedProject(projectId, session.user.email);
    if (!project?.studentEmail) {
      return NextResponse.json({ error: "Project is not assigned to this handler" }, { status: 403 });
    }

    const [update] = await prisma.$transaction([
      prisma.projectProgressUpdate.create({
        data: {
          projectId: project.id,
          studentEmail: project.studentEmail,
          handlerEmail: session.user.email,
          status,
          progress,
          title,
          details
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
      }),
      prisma.project.update({
        where: { id: project.id },
        data: { status }
      }),
      prisma.notification.create({
        data: {
          studentEmail: project.studentEmail,
          title,
          message: details,
          type: "STATUS"
        }
      })
    ]);

    return NextResponse.json(update, { status: 201 });
  } catch (error) {
    console.error("POST progress update error:", error);
    return NextResponse.json({ error: "Failed to update project progress" }, { status: 500 });
  }
}
