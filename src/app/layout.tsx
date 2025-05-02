import type { Metadata } from "next";
import { Poppins, Inter } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";
import { Toaster } from "react-hot-toast";
import { StoreProvider } from "@/components/StoreProvider";

const poppins = Poppins({
  variable: "--font-poppins",
  subsets: ["latin"],
  display: "swap",
  weight: ["400", "500"],
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
  weight: ["500", "600", "700", "800", "900"],
});

export const metadata: Metadata = {
  title: "JZ Mart",
  description:
    "Shop smarter with JZ Mart - your ultimate online shopping destination! Discover a wide range of high-quality products, unbeatable prices, and fast delivery. Experience hassle-free shopping today!",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${poppins.className} ${inter.variable} antialiased`}>
        <StoreProvider>
          <Navbar />
          {children}
          <Toaster position="top-center" />
        </StoreProvider>
      </body>
    </html>
  );
}
