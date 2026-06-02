import type { Metadata } from "next";
import { Chivo, Inter, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import { TopNav } from "@/components/common/top-nav";
import { Footer } from "@/components/common/footer";

const chivo = Chivo({
  variable: "--font-display",
  subsets: ["latin"],
  weight: ["400", "700", "800"],
});

const inter = Inter({
  variable: "--font-body",
  subsets: ["latin"],
  weight: ["400", "500", "600"],
});

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-mono",
  subsets: ["latin"],
  weight: ["400", "500", "700"],
});

export const metadata: Metadata = {
  title: "VAIBREPORT | Premium Intelligence for the Autonomous Frontier",
  description:
    "Synthesizing raw signal from the noise of 130+ data streams. Automated analysis for high-frequency engineering teams — built for Chaos Desktop.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${chivo.variable} ${inter.variable} ${jetbrainsMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col font-body text-on-surface">
        <TopNav />
        <main className="flex-1 pt-[var(--height-top-bar)]">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
