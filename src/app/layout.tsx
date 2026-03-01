import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Waitlist | Meridian",
  description: "Join the Meridian waitlist for early access.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased">{children}</body>
    </html>
  );
}
