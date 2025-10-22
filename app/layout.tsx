import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "DatumOS - Operations Intelligence Platform",
  description: "The world's first Operations Intelligence platform for AEC",
  icons: {
    icon: "/Datum_LogoMark_b.png",
    apple: "/Datum_LogoMark_b.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="font-sans antialiased">
        {children}
      </body>
    </html>
  );
}
