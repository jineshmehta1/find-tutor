import type React from "react"
import type { Metadata } from "next"
import { GeistSans } from "geist/font/sans"
import { GeistMono } from "geist/font/mono"
import { Analytics } from "@vercel/analytics/next"
import { Suspense } from "react"
import  Header  from "@/components/header"
import  Footer  from "@/components/footer"
import "./globals.css"

export const metadata: Metadata = {
  title: " Aacharya - Professional Chess Training",
  description:
    "Professional chess training academy with FIDE rated coaches. Learn chess from beginners to advanced levels with online and offline classes.",
  generator: "v0.app",
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
        <link rel="icon" type="image/png" sizes="32x32" href="" />
        <link rel="icon" type="image/png" sizes="16x16" href="" />
        <link rel="manifest" href="/site.webmanifest" />
        <script type="application/ld+json">
        {`
        {
          "@context": "https://schema.org",
          "@type": "Organization",
          "name": "  Aacharya Sensei  Academy",
          "url": "https://telanganachessschool.com",
          "sameAs": [
            "https://thegeniuschessacademy.com"
          ]
        }
        `}
        </script>
        <meta name="relatedAcademy" content="https://thegeniuschessacademy.com" />
      </head>
      <body className={`font-sans ${GeistSans.variable} ${GeistMono.variable} antialiased`}>
        <Header />
        <Suspense fallback={null}>{children}</Suspense>
        <Footer />
        <Analytics />
      </body>
    </html>
  )
}
