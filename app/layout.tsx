import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

import { supabase } from "@/lib/supabase";

export async function generateMetadata(): Promise<Metadata> {
  const { data } = await supabase.from('setting_site').select('name, favicon, logo').limit(1).single();
  const siteName = data?.name || "MovieDB";
  const iconUrl = data?.favicon || "/favicon.ico";
  
  return {
    title: {
      default: siteName,
      template: `%s | ${siteName}`,
    },
    description: "Experience premium video streaming and fast downloads. Access our powerful REST API for developers.",
    icons: {
      icon: iconUrl,
      shortcut: iconUrl,
      apple: data?.logo || iconUrl,
    },
  };
}

import { Toaster } from "sonner";
import { LanguageProvider } from "@/context/LanguageContext";
import SiteLayout from "@/components/layout/SiteLayout";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <LanguageProvider>
          <Toaster richColors position="top-right" />
          <SiteLayout>
            {children}
          </SiteLayout>
        </LanguageProvider>
      </body>
    </html>
  );
}
