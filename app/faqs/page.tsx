import type { Metadata } from "next";
import FAQsClient from "./faqs-client";
import { AACHARYA_FAQS } from "@/data/faqs";

export const metadata: Metadata = {
  title: "Frequently Asked Questions (FAQs) – AACHARYA | Find Tutors & Coaches Nearby",
  description:
    "Comprehensive guide and answers to frequently asked questions about hiring home tutors, online teachers, activity coaches, CBSE/ICSE curricula, fees, and educator registration on AACHARYA.",
  keywords: [
    "AACHARYA FAQs",
    "home tutor FAQ Vijayawada",
    "tutor discovery questions",
    "find private tutor FAQ",
    "how to hire tutor",
    "tutor fees FAQ",
    "chess coach FAQ",
    "join as tutor FAQ",
  ],
  alternates: {
    canonical: "/faqs",
  },
  openGraph: {
    title: "Frequently Asked Questions – AACHARYA",
    description:
      "All your questions answered about discovering local tutors, activity coaches, posting tuition requirements, and educator registration.",
    url: "/faqs",
    type: "website",
  },
};

export default function FAQsPage() {
  // Schema.org FAQPage structured data for SEO rich snippets
  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: AACHARYA_FAQS.map((faq) => ({
      "@type": "Question",
      name: faq.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: faq.answer,
      },
    })),
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />
      <FAQsClient faqs={AACHARYA_FAQS} />
    </>
  );
}

