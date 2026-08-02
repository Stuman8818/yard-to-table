import type { Metadata } from "next";

import { ApolloProvider } from "@/components/providers/ApolloProvider";

import "./globals.css";

export const metadata: Metadata = {
  title: "Yard To Table | Lawn & Garden Services Launching Soon",
  description:
    "Yard To Table is preparing to launch lawn care and garden services in Indiana, supported by a custom property-planning application.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full antialiased">
      <body className="min-h-full flex flex-col">
        <ApolloProvider>{children}</ApolloProvider>
      </body>
    </html>
  );
}
