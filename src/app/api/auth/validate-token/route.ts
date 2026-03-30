// app/api/auth/validate-token/route.ts
import { NextResponse } from 'next/server';
import { resetTokens } from '../forgot-password/route';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const token = searchParams.get('token');

    console.log("Token validation request for:", token);

    if (!token) {
      return NextResponse.json(
        { valid: false, error: 'Token is required' },
        { status: 400 }
      );
    }

    const tokenData = resetTokens.get(token);
    console.log("Token data found:", tokenData);
    
    if (!tokenData) {
      return NextResponse.json(
        { valid: false, error: 'Invalid token' },
        { status: 200 }
      );
    }

    // Check if token is expired
    if (Date.now() > tokenData.expires) {
      console.log("Token expired, deleting...");
      resetTokens.delete(token);
      return NextResponse.json(
        { valid: false, error: 'Token expired' },
        { status: 200 }
      );
    }

    console.log("Token is valid");
    return NextResponse.json(
      { valid: true, email: tokenData.email },
      { status: 200 }
    );

  } catch (error) {
    console.error('Token validation error:', error);
    return NextResponse.json(
      { valid: false, error: 'Failed to validate token' },
      { status: 500 }
    );
  }
}