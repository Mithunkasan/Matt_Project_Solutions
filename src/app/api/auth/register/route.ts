// import { NextRequest, NextResponse } from "next/server";
// import { prisma } from "@/lib/prisma";
// import bcrypt from "bcryptjs";

// // Enhanced email validation
// const isValidEmail = (email: string): boolean => {
//   const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
//   return emailRegex.test(email);
// };

// const isGoogleEmail = (email: string): boolean => {
//   const googleDomains = ['gmail.com', 'googlemail.com', 'google.com'];
//   const domain = email.split('@')[1]?.toLowerCase();
//   return googleDomains.includes(domain);
// };

// const isDisposableEmail = (email: string): boolean => {
//   const disposableDomains = [
//     'tempmail.com', 'guerrillamail.com', 'mailinator.com', '10minutemail.com',
//     'yopmail.com', 'throwaway.com', 'fakeinbox.com', 'trashmail.com',
//     'temp-mail.org', 'getairmail.com', 'maildrop.cc', 'dispostable.com'
//   ];

//   const domain = email.split('@')[1]?.toLowerCase();
//   return disposableDomains.some(disposable => domain === disposable);
// };

// export async function POST(request: NextRequest) {
//   try {
//     const { name, email, password } = await request.json();

//     if (!name || !email || !password) {
//       return NextResponse.json(
//         { error: "All fields are required" },
//         { status: 400 }
//       );
//     }

//     // Validate email format
//     if (!isValidEmail(email)) {
//       return NextResponse.json(
//         { error: "Please provide a valid email address" },
//         { status: 400 }
//       );
//     }

//     // Check for disposable emails
//     if (isDisposableEmail(email)) {
//       return NextResponse.json(
//         { error: "Temporary email addresses are not allowed. Please use a permanent email like Gmail." },
//         { status: 400 }
//       );
//     }

//     // Encourage Google emails (optional)
//     if (!isGoogleEmail(email)) {
//       console.log(`Non-Google email used: ${email}`);
//       // You can choose to allow non-Google emails but log them
//       // Or restrict to Google emails only by uncommenting below:
//       // return NextResponse.json(
//       //   { error: "Please use a Google email (Gmail) for registration" },
//       //   { status: 400 }
//       // );
//     }

//     // Enhanced password validation (your existing code)
//     const passwordErrors: string[] = [];

//     if (password.length < 8) {
//       passwordErrors.push("Password must be at least 8 characters long");
//     }

//     if (!/(?=.*[a-z])/.test(password)) {
//       passwordErrors.push("Password must contain at least one lowercase letter");
//     }

//     if (!/(?=.*[A-Z])/.test(password)) {
//       passwordErrors.push("Password must contain at least one uppercase letter");
//     }

//     if (!/(?=.*\d)/.test(password)) {
//       passwordErrors.push("Password must contain at least one number");
//     }

//     if (!/(?=.*[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?])/.test(password)) {
//       passwordErrors.push("Password must contain at least one special character");
//     }

//     if (name && password.toLowerCase().includes(name.toLowerCase())) {
//       passwordErrors.push("Password should not contain your name");
//     }

//     if (passwordErrors.length > 0) {
//       return NextResponse.json(
//         { error: "Password does not meet requirements", details: passwordErrors },
//         { status: 400 }
//       );
//     }

//     // Check if user already exists
//     const existingUser = await prisma.user.findUnique({
//       where: { email: email.toLowerCase() }
//     });

//     if (existingUser) {
//       return NextResponse.json(
//         { error: "User already exists with this email" },
//         { status: 400 }
//       );
//     }

//     // Hash password
//     const hashedPassword = await bcrypt.hash(password, 12);

//     // Create user
//     const user = await prisma.user.create({
//       data: {
//         name: name.trim(),
//         email: email.toLowerCase().trim(),
//         password: hashedPassword,
//       },
//     });

//     return NextResponse.json(
//       {
//         message: "User created successfully",
//         isGoogleEmail: isGoogleEmail(email)
//       },
//       { status: 201 }
//     );
//   } catch (error) {
//     console.error("Registration error:", error);
//     return NextResponse.json(
//       { error: "Internal server error" },
//       { status: 500 }
//     );
//   }
// }






import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";
import { Role } from "@prisma/client";

// Enhanced email validation
const isValidEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

const isGoogleEmail = (email: string): boolean => {
  const googleDomains = ['gmail.com', 'googlemail.com', 'google.com'];
  const domain = email.split('@')[1]?.toLowerCase();
  return googleDomains.includes(domain);
};

const isDisposableEmail = (email: string): boolean => {
  const disposableDomains = [
    'tempmail.com', 'guerrillamail.com', 'mailinator.com', '10minutemail.com',
    'yopmail.com', 'throwaway.com', 'fakeinbox.com', 'trashmail.com',
    'temp-mail.org', 'getairmail.com', 'maildrop.cc', 'dispostable.com'
  ];

  const domain = email.split('@')[1]?.toLowerCase();
  return disposableDomains.some(disposable => domain === disposable);
};


export async function POST(request: NextRequest) {
  try {
    const { name, email, password, role } = await request.json();

    if (!name || !email || !password) {
      return NextResponse.json(
        { error: "All fields are required" },
        { status: 400 }
      );
    }

    // Validate email format
    if (!isValidEmail(email)) {
      return NextResponse.json(
        { error: "Please provide a valid email address" },
        { status: 400 }
      );
    }

    // Check for disposable emails
    if (isDisposableEmail(email)) {
      return NextResponse.json(
        { error: "Temporary email addresses are not allowed. Please use a permanent email like Gmail." },
        { status: 400 }
      );
    }

    // Enhanced password validation
    const passwordErrors: string[] = [];

    if (password.length < 8) {
      passwordErrors.push("Password must be at least 8 characters long");
    }

    if (!/(?=.*[a-z])/.test(password)) {
      passwordErrors.push("Password must contain at least one lowercase letter");
    }

    if (!/(?=.*[A-Z])/.test(password)) {
      passwordErrors.push("Password must contain at least one uppercase letter");
    }

    if (!/(?=.*\d)/.test(password)) {
      passwordErrors.push("Password must contain at least one number");
    }

    if (!/(?=.*[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?])/.test(password)) {
      passwordErrors.push("Password must contain at least one special character");
    }

    if (name && password.toLowerCase().includes(name.toLowerCase())) {
      passwordErrors.push("Password should not contain your name");
    }

    if (passwordErrors.length > 0) {
      return NextResponse.json(
        { error: "Password does not meet requirements", details: passwordErrors },
        { status: 400 }
      );
    }

    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email: email.toLowerCase() }
    });

    if (existingUser) {
      return NextResponse.json(
        { error: "User already exists with this email" },
        { status: 400 }
      );
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 12);

    // Create user
    await prisma.user.create({
      data: {
        name: name.trim(),
        email: email.toLowerCase().trim(),
        password: hashedPassword,
        role: (role || 'STUDENT') as Role,
      },
    });

    return NextResponse.json(
      {
        message: "User created successfully",
        isGoogleEmail: isGoogleEmail(email)
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Registration error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}