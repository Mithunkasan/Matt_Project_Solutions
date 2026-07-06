// src/app/api/auth/verify-otp-password/route.ts
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { verifyOTP } from "@/lib/otpStore";
import bcrypt from "bcryptjs";

export async function POST(request: Request) {
  try {
    const { email, otp, password } = await request.json();

    if (!email || !otp || !password) {
      return NextResponse.json(
        { error: "Email, OTP, and password are required" },
        { status: 400 }
      );
    }

    if (password.length < 8) {
      return NextResponse.json(
        { error: "Password must be at least 8 characters long" },
        { status: 400 }
      );
    }

    // Verify OTP
    const verification = verifyOTP(email, otp, "forgot-password");

    if (!verification.success) {
      return NextResponse.json(
        { error: verification.error || "Invalid or expired code" },
        { status: 400 }
      );
    }

    // Hash the new password
    const hashedPassword = await bcrypt.hash(password, 12);

    // Update the password in database
    await prisma.user.update({
      where: { email: email.toLowerCase() },
      data: { password: hashedPassword },
    });

    return NextResponse.json(
      {
        success: true,
        message: "Password reset successfully! You can now log in with your new password.",
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Verify OTP Password error:", error);
    return NextResponse.json(
      { error: "Failed to reset password" },
      { status: 500 }
    );
  }
}
