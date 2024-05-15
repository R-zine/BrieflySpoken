import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Header from "./components/Header";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Briefly Spoken - Demo Page",
  description: "Cision/Brandwatch 2024 Q2 Hackathon Project demo page.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className=

        {inter.className}> <Header />

        {children}</body>
    </html>
  );
}
