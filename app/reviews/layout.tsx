import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Parent & Student Reviews – AACHARYA",
  description:
    "Read genuine reviews and testimonials from parents and students who connected with home tutors, teachers, and activity mentors through AACHARYA.",
  keywords: [
    "AACHARYA reviews",
    "home tutor reviews Vijayawada",
    "tutor feedback",
    "parent testimonials AACHARYA",
  ],
  alternates: {
    canonical: "/reviews",
  },
  openGraph: {
    title: "Parent & Student Reviews – AACHARYA",
    description:
      "Real stories and ratings from families finding academic and skill guidance on AACHARYA.",
    url: "/reviews",
    type: "website",
  },
};

export default function ReviewsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
