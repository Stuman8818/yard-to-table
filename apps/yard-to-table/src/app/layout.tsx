import type { Metadata } from "next";

import "./globals.css";

export const metadata: Metadata = {
  title: "Yard To Table Landscaping",
  description:
    "Thoughtful lawn care, garden planning, installation, and seasonal support for Indiana homeowners.",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className="scroll-smooth antialiased">
      <body>{children}</body>
    </html>
  );
}
