// app/api/auth/reset-password/route.ts
import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import { resetTokens } from '../forgot-password/route';

export async function POST(request: Request) {
  try {
    const { token, password } = await request.json();

    if (!token || !password) {
      return NextResponse.json(
        { error: 'Token and password are required' },
        { status: 400 }
      );
    }

    if (password.length < 6) {
      return NextResponse.json(
        { error: 'Password must be at least 6 characters long' },
        { status: 400 }
      );
    }

    // Get token data
    const tokenData = resetTokens.get(token);
    
    if (!tokenData) {
      return NextResponse.json(
        { error: 'Invalid or expired reset token' },
        { status: 400 }
      );
    }

    // Check if token is expired
    if (Date.now() > tokenData.expires) {
      resetTokens.delete(token);
      return NextResponse.json(
        { error: 'Reset token has expired. Please request a new one.' },
        { status: 400 }
      );
    }

    // Hash new password
    const hashedPassword = await bcrypt.hash(password, 12);

    // TODO: Update user password in your database here
    // This is where you'd connect to your actual database
    console.log(`Password reset for: ${tokenData.email}`);
    console.log(`New hashed password: ${hashedPassword}`);
    
    // Example database update (replace with your actual database code):
    // await updateUserPassword(tokenData.email, hashedPassword);

    // Remove used token
    resetTokens.delete(token);

    console.log(`✅ Password successfully reset for: ${tokenData.email}`);

    return NextResponse.json(
      { message: 'Password reset successfully! You can now login with your new password.' },
      { status: 200 }
    );

  } catch (error) {
    console.error('Reset password error:', error);
    return NextResponse.json(
      { error: 'Failed to reset password' },
      { status: 500 }
    );
  }
}