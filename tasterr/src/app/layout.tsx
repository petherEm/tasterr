import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Navbar } from "@/components/shared/navbar";
import Footer from "@/components/shared/footer";
import { ClerkProvider } from "@clerk/nextjs";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "You shape FMCG future!",
  description:
    "Welcome to Tasterr, the ultimate platform for discovering and sharing your favorite food and beverage products. Join our community of passionate foodies and help shape the future of FMCG by providing valuable feedback to brands and manufacturers. Whether you're a fan of snacks, drinks, or gourmet treats, Tasterr is the perfect place to explore new flavors, connect with like-minded individuals, and make your voice heard. Sign up today and start tasting the future!",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider>
      <html lang="en">
        <body
          className={`${geistSans.variable} ${geistMono.variable} antialiased`}
        >
          <Navbar />
          {children}
          <Footer />
        </body>
      </html>
    </ClerkProvider>
  );
}
