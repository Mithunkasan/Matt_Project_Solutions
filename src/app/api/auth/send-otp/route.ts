// src/app/api/auth/send-otp/route.ts
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { generateOTP, saveOTP } from "@/lib/otpStore";
import { sendOTPEmail } from "@/lib/nodemailer";

export async function POST(request: Request) {
  try {
    const { email, purpose } = await request.json();

    if (!email || !purpose) {
      return NextResponse.json(
        { error: "Email and purpose are required" },
        { status: 400 }
      );
    }

    // Check if the user exists in the database
    const user = await prisma.user.findUnique({
      where: { email: email.toLowerCase() },
    });

    if (!user) {
      return NextResponse.json(
        { error: "No student account found with this email address." },
        { status: 404 }
      );
    }

    // Generate and store OTP
    const otp = generateOTP();
    saveOTP(email, otp, purpose);

    const purposeText = purpose === "forgot-id" ? "Student ID retrieval" : "Password Reset";

    // Send email
    const emailResult = await sendOTPEmail(email, otp, purposeText);

    if (!emailResult.success) {
      console.error("Failed to send OTP email:", emailResult.error);
      
      // For development: allow bypass and return the OTP
      if (process.env.NODE_ENV === "development") {
        return NextResponse.json({
          message: "In development: Email service not configured",
          otp: otp, // Return OTP directly in development
        });
      }

      return NextResponse.json(
        { error: "Failed to send verification email. Please try again." },
        { status: 500 }
      );
    }

    return NextResponse.json(
      { message: "Verification code has been sent to your email!" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Send OTP error:", error);
    return NextResponse.json(
      { error: "Failed to send verification code" },
      { status: 500 }
    );
  }
}
