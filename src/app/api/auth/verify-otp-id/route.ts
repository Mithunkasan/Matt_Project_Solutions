// src/app/api/auth/verify-otp-id/route.ts
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { verifyOTP } from "@/lib/otpStore";

export async function POST(request: Request) {
  try {
    const { email, otp } = await request.json();

    if (!email || !otp) {
      return NextResponse.json(
        { error: "Email and OTP are required" },
        { status: 400 }
      );
    }

    // Verify OTP
    const verification = verifyOTP(email, otp, "forgot-id");

    if (!verification.success) {
      return NextResponse.json(
        { error: verification.error || "Invalid or expired code" },
        { status: 400 }
      );
    }

    // Fetch user details from database
    const user = await prisma.user.findUnique({
      where: { email: email.toLowerCase() },
      select: { name: true, email: true },
    });

    if (!user) {
      return NextResponse.json(
        { error: "Account not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(
      {
        success: true,
        studentId: user.email,
        name: user.name,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Verify OTP ID error:", error);
    return NextResponse.json(
      { error: "Failed to verify code" },
      { status: 500 }
    );
  }
}
