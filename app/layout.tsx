import "./globals.css";
import type { Metadata, Viewport } from "next";
import { SoundProvider } from "@/components/SoundProvider";
import { Nav } from "@/components/Nav";
import { Footer } from "@/components/Footer";

export const metadata: Metadata = {
  title: {
    default: "Tmoi · 个人艺术网站",
    template: "%s · Tmoi",
  },
  description:
    "Tmoi 的个人艺术作品集 —— 暗色策展风，作品本身为中心。呼吸 / 红 / 色彩 / 装置 / 档案 五个系列。",
  keywords: ["艺术", "作品集", "生成艺术", "声音装置", "策展", "Tmoi"],
  openGraph: {
    title: "Tmoi · 个人艺术网站",
    description: "呼吸 / 红 / 色彩 / 装置 / 档案 五个系列的私人策展空间。",
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
