import "./globals.css";
import type { Metadata, Viewport } from "next";
import { SoundProvider } from "@/components/SoundProvider";
import { Nav } from "@/components/Nav";
import { Footer } from "@/components/Footer";

export const metadata: Metadata = {
  title: {
    default: "TMOI · 个人艺术网站",
    template: "%s · TMOI",
  },
  description:
    "TMOI 的个人艺术作品集 —— 暗色策展风，作品本身为中心。包含图像、影像、网页互动与声音交互等多种媒介。",
  keywords: ["艺术", "作品集", "生成艺术", "声音装置", "策展", "TMOI"],
  openGraph: {
    title: "TMOI · 个人艺术网站",
    description: "一个以作品为中心的线上策展空间。",
    type: "website",
  },
};

export const viewport: Viewport = {
  themeColor: "#0a0a0a",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="zh-CN">
      <body className="min-h-screen bg-ink text-paper antialiased">
        <SoundProvider>
          <Nav />
          <main>{children}</main>
          <Footer />
        </SoundProvider>
      </body>
    </html>
  );
}
