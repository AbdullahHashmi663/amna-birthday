import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "For Amna ✦",
  description: "A small birthday universe for Amna.",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="en"><body>{children}</body></html>;
}
