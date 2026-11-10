import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Join as a Student or Parent – Register on AACHARYA",
  description:
    "Create an account on AACHARYA to discover verified home tutors, private teachers, and skill development coaches near you. Free registration for families.",
  keywords: [
    "student sign up",
    "parent registration",
    "find home tutors",
    "AACHARYA account",
  ],
  alternates: {
    canonical: "/signup/student",
  },
  openGraph: {
    title: "Join as a Student or Parent – AACHARYA",
    description:
      "Find the right academic tutor or activity coach for your child. Completely free for parents.",
    url: "/signup/student",
    type: "website",
  },
};

export default function StudentSignupLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}

