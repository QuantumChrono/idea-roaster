import type React from "react"
import type { Metadata } from "next"
import { Geist, Geist_Mono } from "next/font/google"
import { Analytics } from "@vercel/analytics/next"
import "./globals.css"

const _geist = Geist({ subsets: ["latin"] })
const _geistMono = Geist_Mono({ subsets: ["latin"] })

export const metadata: Metadata = {
  metadataBase: new URL("https://unicorpse.vercel.app"),
  title: {
    default: "Unicorpse | Brutal Business Idea Roaster & Startup Validator",
    template: "%s | Unicorpse",
  },
  description:
    "Don't build a unicorn, avoid the corpse. Unicorpse is the ultimate AI business idea roaster. Get a brutally honest critique of your startup idea.",
  keywords: [
    "Unicorpse",
    "business idea roaster",
    "idea roaster",
    "startup validator",
    "AI business consultant",
    "roast my startup",
    "startup ideas",
    "AI startup grader",
  ],
  authors: [{ name: "Swayam" }],
  creator: "Swayam",
  publisher: "Unicorpse",
  openGraph: {
    title: "Unicorpse | Brutal Business Idea Roaster",
    description:
      "Will your startup die? Unicorpse gives you a brutally honest AI roast of your business idea. Validate before you build.",
    url: "https://unicorpse.vercel.app",
    siteName: "Unicorpse",
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Unicorpse | Brutal Business Idea Roaster",
    description: "Get a brutally honest roast of your startup idea. Validate it before you build.",
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
  generator: "v0.app",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className={`font-mono antialiased bg-black text-green-400`}>
        {children}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "SoftwareApplication",
              "name": "Unicorpse",
              "url": "https://unicorpse.vercel.app",
              "applicationCategory": "BusinessApplication",
              "operatingSystem": "Web",
              "description":
                "The ultimate AI business idea roaster. Validate your startup idea instantly.",
              "offers": {
                "@type": "Offer",
                "price": "0",
                "priceCurrency": "USD",
              },
              "author": {
                "@type": "Person",
                "name": "Swayam",
              },
            }),
          }}
        />
        <Analytics />
      </body>
    </html>
  )
}
