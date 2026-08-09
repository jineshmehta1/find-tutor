import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";
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

        // If role doesn't match selected tab, allow login using actual user.role
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
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
  ],
  pages: {
    signIn: "/login",
  },
  session: {
    strategy: "jwt",
  },
  callbacks: {
    async signIn({ user, account, profile }) {
      if (account?.provider === "google") {
        // For Google login, we only allow existing users to sign in
        // On the signup page, we use it for verification only, but NextAuth logs them in.
        // That's fine, the signup page will detect the session.
        return true;
      }
      return true;
    },
    async jwt({ token, user, account }) {
      // Direct login (Credentials)
      if (user) {
        token.id = user.id;
        token.role = user.role;
        token.isApproved = user.isApproved;
      } 
      // OAuth Login (Google) - Fetch user details from DB
      else if (token.email && (account?.provider === "google" || !token.role)) {
        const dbUser = await prisma.user.findUnique({
          where: { email: token.email },
          include: { teacher: true, student: true }
        });

        if (dbUser) {
          token.id = dbUser.id;
          token.role = dbUser.role;
          token.isApproved = dbUser.role === "TEACHER" ? dbUser.teacher?.isApproved : true;
        } else {
          // If user doesn't exist in DB, token.role stays undefined
          // This will trigger middleware redirect to /login
          // Or we can let it be so the signup page can still see the session
        }
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string;
        session.user.role = token.role as any;
        session.user.isApproved = token.isApproved as boolean;
      }
      return session;
    },
  },
  secret: process.env.NEXTAUTH_SECRET,
};