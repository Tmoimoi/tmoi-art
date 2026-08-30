import "./globals.css";
import type { Metadata, Viewport } from "next";
import { SoundProvider } from "@/components/SoundProvider";
import { LanguageProvider } from "@/components/LanguageProvider";
import { Nav } from "@/components/Nav";
import { Footer } from "@/components/Footer";

export const metadata: Metadata = {
  title: {
    default: "Tmoi · Online Museum",
    template: "%s · Tmoi",
  },
  description:
    "Tmoi's online museum — a quiet white-wall space centred on the work itself. Five series: Breath / Red / Color / Installation / Archive.",
  keywords: ["art", "portfolio", "generative art", "sound installation", "museum", "Tmoi"],
  openGraph: {
    title: "Tmoi · Online Museum",
    description:
      "A quiet white-wall online museum centred on the work itself. Five series: Breath / Red / Color / Installation / Archive.",
    type: "website",
  },
};

export const viewport: Viewport = {
  themeColor: "#f6f3ec",
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
        <LanguageProvider>
          <SoundProvider>
            <Nav />
            <main>{children}</main>
            <Footer />
          </SoundProvider>
        </LanguageProvider>
      </body>
    </html>
  );
}
