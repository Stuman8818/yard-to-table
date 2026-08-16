import type { Metadata } from "next";

import "./globals.css";

export const metadata: Metadata = {
  title: "Yard To Table Landscaping | Noblesville & Westfield, IN",
  description:
    "Lawn maintenance, landscaping, cleanups, installations, and garden services in Noblesville and Westfield, Indiana.",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className="scroll-smooth antialiased">
      <body>{children}</body>
    </html>
  );
}
