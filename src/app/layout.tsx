import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { SessionProvider } from "@/components/providers/SessionProvider";
import { PersistentBackground } from "@/components/ui/PersistentBackground";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "EcoTrace AI | Small Actions. Massive Impact.",
  description: "Understand, track, and reduce your carbon footprint through personalized insights and simple actions.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${inter.variable} antialiased dark`}
    >
      <body className="min-h-screen bg-background text-foreground flex flex-col font-sans selection:bg-primary selection:text-primary-foreground relative">
        <PersistentBackground />
        <SessionProvider>{children}</SessionProvider>
      </body>
    </html>
  );
}
