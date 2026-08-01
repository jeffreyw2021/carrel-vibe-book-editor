import type { Metadata } from "next";
import { Urbanist, Inter } from "next/font/google";
import NextAuthProvider from "@/config/providers/NextAuthProvider";
import MuiProvider from "@/config/providers/MuiProvider";
import EmotionRegistry from "@/config/providers/EmotionRegistry";
import DebugBar from "@/components/debug/DebugBar";
import "./globals.css";

const urbanist = Urbanist({
  variable: "--font-urbanist",
  subsets: ["latin"],
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Carrel",
  description: "A vibe book editor",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${urbanist.variable} ${inter.variable} h-full`}>
      <body className="m-0 p-0 antialiased h-full w-full flex flex-col">
        <NextAuthProvider>
          <EmotionRegistry options={{ key: "css" }}>
            <MuiProvider>
              {children}
              {process.env.NODE_ENV === "development" && <DebugBar />}
            </MuiProvider>
          </EmotionRegistry>
        </NextAuthProvider>
      </body>
    </html>
  );
}
