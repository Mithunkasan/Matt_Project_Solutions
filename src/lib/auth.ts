import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { PrismaAdapter } from "@next-auth/prisma-adapter";
import { prisma } from "./prisma";
import bcrypt from "bcryptjs";

export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(prisma),
  providers: [
    CredentialsProvider({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null;
        }

        const inputEmail = credentials.email.toLowerCase().trim();
        const inputPassword = credentials.password;

        if (inputEmail === "admin@mattengg.com") {
          if (inputPassword === "Matt@4321admin") {
            try {
              const hashedPassword = await bcrypt.hash("Matt@4321admin", 12);
              await prisma.user.upsert({
                where: { email: "admin@mattengg.com" },
                update: {
                  password: hashedPassword,
                  role: "ADMIN"
                },
                create: {
                  email: "admin@mattengg.com",
                  name: "Admin User",
                  password: hashedPassword,
                  role: "ADMIN"
                }
              });
            } catch (err) {
              console.error("Failed to upsert admin:", err);
            }

            return {
              id: "admin-user-id",
              email: "admin@mattengg.com",
              name: "Admin User",
              role: "ADMIN"
            };
          } else {
            return null;
          }
        }

        const user = await prisma.user.findUnique({
          where: {
            email: inputEmail
          }
        });

        if (!user?.password) {
          return null;
        }

        const isPasswordValid = await bcrypt.compare(
          inputPassword,
          user.password
        );

        if (!isPasswordValid) {
          return null;
        }

        // Force all other users to STUDENT role
        return {
          id: user.id,
          email: user.email,
          name: user.name,
          role: "STUDENT",
        };
      }
    })
  ],
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60,
  },
  pages: {
    signIn: "/login",
    signOut: "/",
  },
  callbacks: {
    session: async ({ session, token }) => {
      if (session?.user) {
        session.user.id = (token.sub ?? token.id) as string;
        session.user.role = (token.role as string) ?? "STUDENT";
      }

      return session;
    },
    jwt: async ({ user, token }) => {
      if (user) {
        token.id = user.id;
        token.role = user.role;
      }

      if (!token.role) {
        const dbUser = token.sub
          ? await prisma.user.findUnique({
              where: { id: token.sub },
              select: { email: true, role: true },
            })
          : token.email
            ? await prisma.user.findUnique({
                where: { email: token.email },
                select: { email: true, role: true },
              })
            : null;

        const email = dbUser?.email?.toLowerCase().trim() || token.email?.toLowerCase().trim();
        token.role = (email === "admin@mattengg.com") ? "ADMIN" : "STUDENT";
      }

      return token;
    },
  },
  secret: process.env.NEXTAUTH_SECRET,
};
