// src/app/api/internship/apply/route.ts
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(request: Request) {
  try {
    const { fullName, collegeName, department, yearOfStudy, email, phoneNumber } = await request.json();

    // Validation
    if (!fullName || !collegeName || !yearOfStudy || !email || !phoneNumber) {
      return NextResponse.json(
        { error: "All fields are required" },
        { status: 400 }
      );
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: "Please enter a valid email address" },
        { status: 400 }
      );
    }

    if (phoneNumber.length < 10) {
      return NextResponse.json(
        { error: "Please enter a valid phone number" },
        { status: 400 }
      );
    }

    // Save to the database
    const application = await prisma.internshipApplication.create({
      data: {
        fullName,
        collegeName,
        department: department || null,
        yearOfStudy,
        email: email.toLowerCase(),
        phoneNumber,
      },
    });

    return NextResponse.json(
      {
        success: true,
        message: "Your internship application has been submitted successfully!",
        applicationId: application.id,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Internship application submission error:", error);
    return NextResponse.json(
      { error: "Failed to submit application. Please try again." },
      { status: 500 }
    );
  }
}
