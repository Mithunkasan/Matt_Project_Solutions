import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(request: NextRequest) {
  try {
    const { email } = await request.json();

    if (!email) {
      return NextResponse.json(
        { error: "Email is required" },
        { status: 400 }
      );
    }

    const cleanEmail = email.toLowerCase().trim();

    // 1. Check if the user already exists in the users table
    const existingUser = await prisma.user.findUnique({
      where: { email: cleanEmail }
    });

    if (existingUser) {
      return NextResponse.json({
        email,
        allowed: false,
        error: "This email is already registered. Please login instead."
      });
    }

    // 2. Check if the email exists in Projects
    const projectCount = await prisma.project.count({
      where: { studentEmail: cleanEmail }
    });

    // 3. Check if the email exists in CourseEnrollments
    const enrollmentCount = await prisma.courseEnrollment.count({
      where: { studentEmail: cleanEmail }
    });

    // 4. Check if the email exists in ClassSchedules (as fallback)
    const scheduleCount = await prisma.classSchedule.count({
      where: { studentEmail: cleanEmail }
    });

    const isAllowed = projectCount > 0 || enrollmentCount > 0 || scheduleCount > 0;

    return NextResponse.json({
      email,
      allowed: isAllowed,
      message: isAllowed 
        ? "Email verification successful! You may now complete your registration." 
        : "This email is not registered under any Project or Course by the Admin. Please contact the administrator to get assigned first."
    });

  } catch (error) {
    console.error("Email registration check error:", error);
    return NextResponse.json(
      { error: "Internal server error during email verification" },
      { status: 500 }
    );
  }
}