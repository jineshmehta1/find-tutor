import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Join as a Teacher or Coach – Register on AACHARYA",
  description:
    "Register as a verified home tutor, private teacher, activity coach, or training institute on AACHARYA. Connect directly with students and parents nearby with zero agency cuts.",
  keywords: [
    "join as tutor",
    "become home tutor Vijayawada",
    "teacher registration",
    "coach sign up",
    "tutoring jobs nearby",
  ],
  alternates: {
    canonical: "/signup/teacher",
  },
  openGraph: {
    title: "Join as a Teacher or Coach – AACHARYA",
    description:
      "Grow your teaching journey. Receive student tuition inquiries in your neighborhood.",
    url: "/signup/teacher",
    type: "website",
  },
};

export default function TeacherSignupLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
