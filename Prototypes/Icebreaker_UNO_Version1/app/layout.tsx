import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Icebreaker UNO",
  description: "A five-player private-alliance layer for physical UNO.",
  icons: {
    icon: "/favicon.svg",
    shortcut: "/favicon.svg",
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
