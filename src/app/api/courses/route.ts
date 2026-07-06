import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    if (session.user.role === "ADMIN") {
      const courses = await prisma.course.findMany({
        include: {
          enrollments: true,
          schedules: true
        },
        orderBy: { createdAt: "desc" }
      });
      return NextResponse.json(courses);
    } else {
      // Find courses where the student is enrolled
      const enrollments = await prisma.courseEnrollment.findMany({
        where: { studentEmail: session.user.email },
        include: {
          course: {
            include: {
              schedules: true
            }
          }
        }
      });
      
      const courses = enrollments.map(e => ({
        ...e.course,
        progress: e.progress,
        status: e.status
      }));

      return NextResponse.json(courses);
    }
  } catch (error) {
    console.error("GET courses error:", error);
    return NextResponse.json({ error: "Failed to fetch courses" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id || session.user.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { name, description, department, duration, faculty } = body;

    if (!name || !department || !duration || !faculty) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const course = await prisma.course.create({
      data: {
        name,
        description,
        department,
        duration,
        faculty
      }
    });

    return NextResponse.json(course, { status: 201 });
  } catch (error) {
    console.error("POST course error:", error);
    return NextResponse.json({ error: "Failed to create course" }, { status: 500 });
  }
}
