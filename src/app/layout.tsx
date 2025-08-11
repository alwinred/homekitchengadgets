import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { SessionProvider } from "@/components/session-provider";
import { Navigation } from "@/components/navigation";
import { Footer } from "@/components/footer";
import { AdSenseScript } from "@/components/adsense-script";
import { Toaster } from "sonner";
import "./globals.css";
import "../styles/jodit.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "BlogReview - Product Reviews & Tech Blog",
  description: "Discover in-depth product reviews, tech insights, and buying guides to help you make informed decisions.",
  keywords: "product reviews, tech blog, buying guides, affiliate marketing",
  authors: [{ name: "BlogReview Team" }],
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://blogreview.com",
    title: "BlogReview - Product Reviews & Tech Blog",
    description: "Discover in-depth product reviews, tech insights, and buying guides to help you make informed decisions.",
    siteName: "BlogReview",
  },
  twitter: {
    card: "summary_large_image",
    title: "BlogReview - Product Reviews & Tech Blog",
    description: "Discover in-depth product reviews, tech insights, and buying guides to help you make informed decisions.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <AdSenseScript />
        <SessionProvider>
          <Navigation />
          <main className="min-h-screen">
            {children}
          </main>
          <Footer />
          <Toaster />
        </SessionProvider>
      </body>
    </html>
  );
}
