import type { Metadata, Viewport } from "next";
import { GeistSans } from "geist/font/sans";
import { GeistMono } from "geist/font/mono";
import { Analytics } from "@vercel/analytics/next";
import { Suspense } from "react";
import LayoutWrapper from "@/components/layout-wrapper";
import Providers from "@/components/providers";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL("https://aacharya-tutor.vercel.app"),
  title: {
    default: "AACHARYA – Find Home Tutors, Academic Teachers & Coaches Nearby",
    template: "%s | AACHARYA",
  },
  description:
    "Discover verified home tutors, online teachers, and activity coaches for CBSE, ICSE, State Boards, Chess, Robotics, Abacus, Coding, Music and Arts nearby. 0% commission for parents.",
  keywords: [
    "AACHARYA",
    "home tutors nearby",
    "find tutors nearby",
    "private tutors Vijayawada",
    "online teachers",
    "chess coach nearby",
    "robotics classes",
    "abacus training",
    "CBSE home tutor",
    "ICSE tuition",
    "post tuition requirement",
  ],
  authors: [{ name: "AACHARYA Team" }],
  creator: "AACHARYA",
  publisher: "AACHARYA",
  formatDetection: {
    email: true,
    address: true,
    telephone: true,
  },
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: "AACHARYA – Find Home Tutors, Academic Teachers & Coaches Nearby",
    description:
      "Connect with verified local tutors and skill development coaches for academic subjects, board exams, chess, coding, and extracurricular activities.",
    url: "https://aacharya-tutor.vercel.app",
    siteName: "AACHARYA",
    locale: "en_IN",
    type: "website",
    images: [
      {
        url: "/image.png",
        width: 800,
        height: 600,
        alt: "AACHARYA – Find Tutors & Coaches Nearby",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "AACHARYA – Find Home Tutors, Academic Teachers & Coaches Nearby",
    description:
      "Connect with verified local tutors and skill development coaches for academic subjects, board exams, chess, coding, and extracurricular activities.",
    images: ["/image.png"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  themeColor: "#ffb800",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const structuredData = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebSite",
        "@id": "https://aacharya-tutor.vercel.app/#website",
        "url": "https://aacharya-tutor.vercel.app",
        "name": "AACHARYA",
        "description": "Find Home Tutors, Academic Teachers & Coaches Nearby",
        "potentialAction": {
          "@type": "SearchAction",
          "target": "https://aacharya-tutor.vercel.app/find-tutor-nearby?q={search_term_string}",
          "query-input": "required name=search_term_string"
        }
      },
      {
        "@type": "Organization",
        "@id": "https://aacharya-tutor.vercel.app/#organization",
        "name": "AACHARYA",
        "url": "https://aacharya-tutor.vercel.app",
        "logo": "https://aacharya-tutor.vercel.app/image.png",
        "description": "Online tutor and coach discovery platform connecting parents and students with verified academic tutors, home teachers, and activity mentors.",
        "founder": {
          "@type": "Person",
          "name": "Dr. Rajesh Gunti",
          "jobTitle": "Founder",
          "description": "Academician and Professor of Mechanical Engineering with over 20 years of teaching experience, committed to making quality learning opportunities more accessible."
        },
        "contactPoint": {
          "@type": "ContactPoint",
          "telephone": "+91-8074103400",
          "contactType": "customer service",
          "areaServed": "IN",
          "availableLanguage": ["English", "Telugu", "Hindi"]
        },
        "address": {
          "@type": "PostalAddress",
          "addressLocality": "Vijayawada",
          "addressRegion": "Andhra Pradesh",
          "addressCountry": "IN"
        },
        "sameAs": [
          "https://www.facebook.com/share/17MqucMzGu/",
          "https://www.instagram.com/aacharya_bhavanipuram",
          "https://youtube.com/@aacharyaclasses",
          "https://www.linkedin.com/company/aacharya/"
        ]
      }
    ]
  };

  return (
    <html lang="en">
      <head>
        <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
        <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png" />
        <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png" />
        <link rel="manifest" href="/site.webmanifest" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(structuredData),
          }}
        />
      </head>
      <body className={`font-sans ${GeistSans.variable} ${GeistMono.variable} antialiased`}>
        <Providers>
          <LayoutWrapper>
            <Suspense fallback={null}>{children}</Suspense>
          </LayoutWrapper>
        </Providers>
        <Analytics />
      </body>
    </html>
  );
}
