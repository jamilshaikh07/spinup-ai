import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Spinup AI",
  description: "All your AI models in one place. Claude, GPT-4, DeepSeek — one subscription.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
