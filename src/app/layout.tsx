// Type
import type { Metadata } from "next";

// Module
import { Geist, Geist_Mono } from "next/font/google";
import { Providers } from "./provider";

// Style
import "@/styles/Global/globals.css";
import "@/styles/Global/scroll.css";
import styles from '@/styles/Global/Layout.module.css';

// Component
import Header from "@/components/Header";
import Footer from "@/components/Footer";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://run.mingdao.edu.tw"),
  title: "為夢想而跑",
  description:
    "與畢業生和師長們一同累積里程、挑戰排行榜、超越極限！每一步都帶你更接近夢想，每一公里都讓畢業更有意義！",
  applicationName: "為夢想而跑",
  authors: [{ name: "林杰陞、廖耿鋒" }],
  keywords: ["夢", "為夢想而跑", "夢想", "明道", "跑步", "里程", "競賽"],
  icons: {
    icon: [
      { url: "/icons/favicon-16x16.png", sizes: "16x16", type: "image/png" },
      { url: "/icons/favicon-32x32.png", sizes: "32x32", type: "image/png" },
      { url: "/icons/icon-192x192.png", sizes: "192x192", type: "image/png" },
      { url: "/icons/icon-512x512.png", sizes: "512x512", type: "image/png" },
    ],
    apple: [
      {
        url: "/icons/apple-touch-icon.png",
        sizes: "180x180",
        type: "image/png",
      },
    ],
    shortcut: { url: "/icons/favicon-32x32.png" },
  },
  creator: "明道中學畢業班級聯合會",
  publisher: "明道中學",
  openGraph: {
    type: "website",
    url: "https://run.mingdao.edu.tw",
    title: "為夢想而跑",
    description: "與畢業生和師長們一同累積里程、挑戰排行榜、超越極限！每一步都帶你更接近夢想，每一公里都讓畢業更有意義！",
    images: [{
      url: "https://run.mingdao.edu.tw/banners/banner-compressed.jpg",
    }],
  },
  twitter: {
    title: "為夢想而跑",
    description: "與畢業生和師長們一同累積里程、挑戰排行榜、超越極限！每一步都帶你更接近夢想，每一公里都讓畢業更有意義！",
    card: "summary_large_image",
    images: "https://run.mingdao.edu.tw/banners/banner-compressed.jpg"
  },
  other: {
    "twitter:url": "https://run.mingdao.edu.tw"
  }
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
        <Providers>
          <Header />
          <div className={styles.layout}>
            <main className={styles.main}>
              {children}
            </main>
          </div>
          <Footer />
        </Providers>
      </body>
    </html>
  );
}
