import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";

// Extend next-auth types
declare module "next-auth" {
  interface User {
    id: string;
    name: string;
    email: string;
    role: "ADMIN" | "TEACHER" | "STUDENT";
    isApproved?: boolean;
  }
  interface Session {
    user: User;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id: string;
    role: "ADMIN" | "TEACHER" | "STUDENT";
    isApproved?: boolean;
  }
}

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
        role: { label: "Role", type: "text" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password || !credentials?.role) {
          return null;
        }

        const selectedRole = credentials.role as "ADMIN" | "TEACHER" | "STUDENT";

        // Check for legacy admin login (environment variables)
        if (
          credentials.email === process.env.ADMIN_EMAIL &&
          credentials.password === process.env.ADMIN_PASSWORD
        ) {
          if (selectedRole !== "ADMIN") {
            return null;
          }
          return {
            id: "admin-legacy",
            name: "Admin",
            email: credentials.email,
            role: "ADMIN" as const,
            isApproved: true,
          };
        }

        // Database user lookup
        const user = await prisma.user.findUnique({
          where: { email: credentials.email },
          include: {
            teacher: true,
            student: true,
          },
        });

        if (!user) {
          return null;
        }

        // Verify password
        const isValidPassword = await bcrypt.compare(
          credentials.password,
          user.password
        );

        if (!isValidPassword) {
          return null;
        }

        // Verify the selected role matches the user's actual role
        if (user.role !== selectedRole) {
          return null;
        }

        // Determine approval status for teachers
        const isApproved = user.role === "TEACHER"
          ? user.teacher?.isApproved ?? false
          : true;

        return {
          id: user.id,
          name: user.name,
          email: user.email,
          role: user.role,
          isApproved,
        };
      },
    }),
  ],
  pages: {
    signIn: "/login",
  },
  session: {
    strategy: "jwt",
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.role = user.role;
        token.isApproved = user.isApproved;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id;
        session.user.role = token.role;
        session.user.isApproved = token.isApproved;
      }
      return session;
    },
  },
  secret: process.env.NEXTAUTH_SECRET,
};