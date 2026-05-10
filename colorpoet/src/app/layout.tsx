import type { Metadata } from "next";
import { Inter, Cormorant_Garamond, Bangers } from "next/font/google";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

const cormorant = Cormorant_Garamond({
  variable: "--font-cormorant",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  display: "swap",
});

const bangers = Bangers({
  variable: "--font-bangers",
  subsets: ["latin"],
  weight: ["400"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "ColorPoet - AI Poetry from Colors",
  description: "Generate beautiful poems from colors using hand tracking",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${inter.variable} ${cormorant.variable} ${bangers.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col font-ui">{children}</body>
    </html>
  );
}
