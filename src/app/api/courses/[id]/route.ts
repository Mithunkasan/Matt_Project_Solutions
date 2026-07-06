import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id || session.user.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { action, name, description, department, duration, faculty, studentEmail, studentName, progress, status } = body;

    if (action === "enroll") {
      if (!studentEmail || !studentName) {
        return NextResponse.json({ error: "Missing enrollment details" }, { status: 400 });
      }
      
      const enrollment = await prisma.courseEnrollment.upsert({
        where: {
          courseId_studentEmail: {
            courseId: params.id,
            studentEmail: studentEmail.toLowerCase().trim()
          }
        },
        update: {
          studentName
        },
        create: {
          courseId: params.id,
          studentEmail: studentEmail.toLowerCase().trim(),
          studentName,
          progress: 0,
          status: "Active"
        }
      });
      return NextResponse.json(enrollment);
    }

    if (action === "update-progress") {
      if (!studentEmail) {
        return NextResponse.json({ error: "Missing student email" }, { status: 400 });
      }
      
      const enrollment = await prisma.courseEnrollment.update({
        where: {
          courseId_studentEmail: {
            courseId: params.id,
            studentEmail: studentEmail.toLowerCase().trim()
          }
        },
        data: {
          progress: typeof progress === "number" ? progress : undefined,
          status: status || undefined
        }
      });
      return NextResponse.json(enrollment);
    }

    if (action === "unenroll") {
      if (!studentEmail) {
        return NextResponse.json({ error: "Missing student email" }, { status: 400 });
      }
      
      await prisma.courseEnrollment.delete({
        where: {
          courseId_studentEmail: {
            courseId: params.id,
            studentEmail: studentEmail.toLowerCase().trim()
          }
        }
      });
      return NextResponse.json({ success: true });
    }

    // Default update course details
    const course = await prisma.course.update({
      where: { id: params.id },
      data: {
        name: name || undefined,
        description: description !== undefined ? description : undefined,
        department: department || undefined,
        duration: duration || undefined,
        faculty: faculty || undefined
      }
    });

    return NextResponse.json(course);
  } catch (error) {
    console.error("PUT course error:", error);
    return NextResponse.json({ error: "Failed to update course" }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id || session.user.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await prisma.course.delete({
      where: { id: params.id }
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("DELETE course error:", error);
    return NextResponse.json({ error: "Failed to delete course" }, { status: 500 });
  }
}
