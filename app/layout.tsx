import type React from "react"
import type { Metadata } from "next"
import { GeistSans } from "geist/font/sans"
import { GeistMono } from "geist/font/mono"
import { Analytics } from "@vercel/analytics/next"
import { Suspense } from "react"
import LayoutWrapper from "@/components/layout-wrapper"
import Providers from "@/components/providers"
import "./globals.css"

export const metadata: Metadata = {
  title: "Aacharya – Complete Learning Center for Children in Bhavanipuram, Vijayawada",
  description:
    "Aacharya Learning Hub in Bhavanipuram, Vijayawada offers Pre Primary School, Chess Academy, Robotics Center, Abacus training and Tuition for children. One campus for complete child development.",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <head>
        <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
        <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png" />
        <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png" />
        <link rel="manifest" href="/site.webmanifest" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Organization",
              "name": "  Aacharya Sensei  Academy",
              "url": "https://telanganachessschool.com",
              "sameAs": ["https://thegeniuschessacademy.com"],
            }),
          }}
        />
        <meta name="relatedAcademy" content="https://thegeniuschessacademy.com" />
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
  )
}

