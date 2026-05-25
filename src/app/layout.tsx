import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Ounch Items",
  description: "Assessment - Server-rendered MySQL items browser built with Next.js and HeroUI.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="light h-full antialiased">
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
