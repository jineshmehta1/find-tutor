import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Sign In – AACHARYA",
  description:
    "Log in to your AACHARYA account to manage your tutor profile, inquiries, student leads, and learning schedule.",
  alternates: {
    canonical: "/login",
  },
};

export default function LoginLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}

