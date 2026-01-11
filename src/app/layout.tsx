import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  themeColor: "#0f172a",
};

export const metadata: Metadata = {
  title: "Password Manager PWA",
  description: "Aplikasi penyimpanan akun dengan fitur backup dan share ke WhatsApp",
  keywords: ["Password Manager", "PWA", "Next.js", "TypeScript", "Tailwind CSS", "shadcn/ui"],
  authors: [{ name: "Password Manager Team" }],
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "Password Manager"
  },
  icons: {
    icon: ["/icon-192x192.png", "/icon-512x512.png"],
    apple: ["/icon-192x192.png", "/icon-512x512.png"]
  }
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-background text-foreground`}
      >
        {children}
        <Toaster />
        <script
          dangerouslySetInnerHTML={{
            __html: `
              if ('serviceWorker' in navigator) {
                navigator.serviceWorker.register('/sw.js').then(
                  (registration) => {
                    console.log('Service Worker registered: ', registration);
                  },
                  (error) => {
                    console.error('Service Worker registration failed: ', error);
                  }
                );
              }
            `,
          }}
        />
      </body>
    </html>
  );
}
