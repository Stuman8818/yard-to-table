import type { Metadata } from "next";

import { ApolloProvider } from "@/components/providers/ApolloProvider";

import "./globals.css";

export const metadata: Metadata = {
  title: "Trellis | Yard To Table Operations",
  description: "Customer intake and field-service operations for Yard To Table Landscaping.",
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
