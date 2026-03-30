// app/api/auth/forgot-password/route.ts
import { NextResponse } from 'next/server';
import crypto from 'node:crypto';
import { sendPasswordResetEmail } from '@/lib/nodemailer';

// In-memory token storage (use database in production)
const resetTokens = new Map();

export async function POST(request: Request) {
  try {
    const { email } = await request.json();

    if (!email) {
      return NextResponse.json(
        { error: 'Email is required' },
        { status: 400 }
      );
    }

    // Validate email format
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return NextResponse.json(
        { error: 'Please enter a valid email address' },
        { status: 400 }
      );
    }

    // Generate reset token
    const token = crypto.randomBytes(32).toString('hex');
    const expires = Date.now() + 3600000; // 1 hour

    // Store token
    resetTokens.set(token, {
      email,
      expires,
      createdAt: new Date().toISOString()
    });

    // Create reset link
    const resetLink = `${process.env.NEXTAUTH_URL || 'https://matt-projects-dashboard-3jae.vercel.app'}/reset-password?token=${token}`;

    console.log('Sending reset email to:', email);
    console.log('Reset link:', resetLink);

    // Send email
    const emailResult = await sendPasswordResetEmail(email, resetLink);

    if (!emailResult.success) {
      console.error('Email sending failed:', emailResult.error);

      // For development: return the reset link directly
      if (process.env.NODE_ENV === 'development') {
        return NextResponse.json({
          message: 'In development: Email service not configured',
          resetLink: resetLink
        });
      }

      return NextResponse.json(
        { error: 'Failed to send reset email. Please try again.' },
        { status: 500 }
      );
    }

    console.log('Reset email sent successfully:', emailResult.messageId);

    return NextResponse.json(
      { message: 'Password reset link has been sent to your email!' },
      { status: 200 }
    );

  } catch (error) {
    console.error('Forgot password error:', error);
    return NextResponse.json(
      { error: 'Failed to process reset request' },
      { status: 500 }
    );
  }
}

// Helper to check if token is valid
export function isValidToken(token: string) {
  const tokenData = resetTokens.get(token);
  if (!tokenData) return false;

  if (Date.now() > tokenData.expires) {
    resetTokens.delete(token);
    return false;
  }

  return true;
}

// Export for use in reset-password route
export { resetTokens };