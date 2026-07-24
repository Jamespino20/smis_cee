import type { Metadata, Viewport } from "next";
import "./globals.css";

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  themeColor: "#0F0F1A",
};

export const metadata: Metadata = {
  title: "A Letter from Vestia | Happy Birthday Smiscee",
  description:
    "A magical birthday message from the world of Vestia, crafted with love for Smiscee.",
  openGraph: {
    title: "A Letter from Vestia | Happy Birthday Smiscee",
    description:
      "A magical birthday message from the world of Vestia, crafted with love.",
    type: "website",
  },
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
