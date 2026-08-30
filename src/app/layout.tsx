import type { Metadata } from "next"
import { Inter, Cormorant_Garamond } from "next/font/google"
import "./globals.css"
import { Providers } from "@/components/Providers"

export const dynamic = 'force-dynamic'

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
})

const cormorant = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-cormorant",
  display: "swap",
})

export const metadata: Metadata = {
  title: {
    default: "Talal Garments | Since 1988 — Craftsmanship Through Generations",
    template: "%s | Talal Garments",
  },
  description:
    "Three generations of master tailors since 1988. Premium stitched & unstitched clothing for men and women. Nationwide delivery across Pakistan with cash on delivery.",
  keywords: [
    "Talal Garments",
    "Pakistani clothing",
    "shalwar kameez",
    "kurta",
    "women lawn suits",
    "unstitched fabric",
    "online clothing Pakistan",
    "Attock garments",
  ],
  openGraph: {
    title: "Talal Garments | Since 1988 — Craftsmanship Through Generations",
    description:
      "Premium stitched & unstitched clothing for men and women. Nationwide delivery across Pakistan.",
    type: "website",
    locale: "en_PK",
    siteName: "Talal Garments",
  },
  twitter: {
    card: "summary_large_image",
    title: "Talal Garments | Since 1988",
    description:
      "Premium stitched & unstitched clothing for men and women. Nationwide delivery across Pakistan.",
  },
  robots: {
    index: true,
    follow: true,
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "Talal Garments",
    description: "Premium clothing for men and women since 1988. Three generations of master tailors.",
    foundingDate: "1988",
    url: process.env.NEXT_PUBLIC_APP_URL || "https://talal-garmentss.vercel.app",
    address: {
      "@type": "PostalAddress",
      addressLocality: "Attock",
      addressCountry: "PK",
    },
  }

  return (
    <html lang="en" className={`${inter.variable} ${cormorant.variable}`}>
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body className="antialiased min-h-screen flex flex-col relative bg-ivory text-primary">
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  )
}
