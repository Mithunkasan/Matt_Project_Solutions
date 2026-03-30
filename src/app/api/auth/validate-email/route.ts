import { NextRequest, NextResponse } from "next/server";

// This is a simplified version - for production, use a proper email validation service
export async function POST(request: NextRequest) {
  try {
    const { email } = await request.json();

    if (!email) {
      return NextResponse.json(
        { error: "Email is required" },
        { status: 400 }
      );
    }

    // Basic validation - in production, you would use a service like:
    // - ZeroBounce
    // - Hunter.io
    // - NeverBounce
    // - MailboxValidator

    const domain = email.split('@')[1]?.toLowerCase();
    
    // Simple domain existence check (very basic)
    const isValidDomain = await checkDomainExistence(domain);
    
    return NextResponse.json({
      email,
      exists: isValidDomain,
      message: isValidDomain ? "Email domain is valid" : "Email domain may not exist"
    });

  } catch (error) {
    console.error("Email validation error:", error);
    return NextResponse.json(
      { error: "Email validation service unavailable" },
      { status: 500 }
    );
  }
}

// Basic domain existence check
async function checkDomainExistence(domain: string): Promise<boolean> {
  try {
    // This is a very basic check - in production, use proper email validation services
    const response = await fetch(`https://dns.google/resolve?name=${domain}&type=MX`);
    const data = await response.json();
    
    return data.Answer && data.Answer.length > 0;
  } catch (error) {
    console.error("Domain check error:", error);
    return true; // Fallback to true to avoid blocking legitimate emails
  }
}