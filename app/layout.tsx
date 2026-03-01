import "./globals.css";
import type { Metadata } from "next";
import Script from "next/script";
import { Toaster } from "@/components/ui/sonner";

export const metadata: Metadata = {
  title: "Meridian Waitlist",
  description:
    "Join the waitlist for Meridian, a transit app tailored to your needs.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark" suppressHydrationWarning>
      <head>
        <meta property="og:image" content="/opengraph-image.png" />
        <meta property="og:image:type" content="image/png" />
        <meta property="og:image:width" content="1280" />
        <meta property="og:image:height" content="832" />
        <meta name="twitter:image" content="/twitter-image.png" />
        <meta name="twitter:image:type" content="image/png" />
        <meta name="twitter:image:width" content="1280" />
        <meta name="twitter:image:height" content="832" />
        <Script
          async
          src="https://www.googletagmanager.com/gtag/js?id=G-DEBK9S5P9M"
          strategy="afterInteractive"
        />
        <Script id="google-analytics" strategy="afterInteractive">
          {`window.dataLayer = window.dataLayer || [];
function gtag(){dataLayer.push(arguments);}
gtag('js', new Date());
gtag('config', 'G-DEBK9S5P9M');`}
        </Script>
      </head>
      <body>
        {children}
        <Toaster richColors position="top-center" />
      </body>
    </html>
  );
}
