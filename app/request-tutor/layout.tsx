import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Post Your Requirement – Get Matched with Verified Tutors & Coaches",
  description:
    "Post your tuition or activity learning requirement on AACHARYA. Connect with qualified local home tutors, online teachers, and activity mentors matching your specific needs. 100% free for parents.",
  keywords: [
    "post tuition requirement",
    "need home tutor",
    "hire private teacher",
    "request tutor Vijayawada",
    "find tutor for child",
    "activity coach requirement",
  ],
  alternates: {
    canonical: "/request-tutor",
  },
  openGraph: {
    title: "Post Your Requirement – AACHARYA",
    description:
      "Share your learning goals and schedule to receive responses from interested, verified local tutors and coaches.",
    url: "/request-tutor",
    type: "website",
  },
};

export default function RequestTutorLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}

