import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Find Tutors & Coaches Nearby – Search Home & Online Tutors",
  description:
    "Search and compare verified home tutors, private teachers, and activity coaches near you. Filter by subject, class, curriculum board (CBSE, ICSE, State), location, and fee rates.",
  keywords: [
    "find tutors nearby",
    "home tutors near me",
    "private teacher Vijayawada",
    "maths tutor",
    "science tuition",
    "chess coach nearby",
    "online tutor India",
    "activity coaches",
  ],
  alternates: {
    canonical: "/find-tutor-nearby",
  },
  openGraph: {
    title: "Find Tutors & Coaches Nearby – AACHARYA",
    description:
      "Explore verified profiles of home tutors, online teachers, and activity coaches. Contact educators directly with 0% commission.",
    url: "/find-tutor-nearby",
    type: "website",
  },
};

export default function FindTutorLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
