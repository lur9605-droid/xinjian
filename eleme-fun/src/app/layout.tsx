import type { Metadata, Viewport } from "next";
import "./globals.css";

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
};

export const metadata: Metadata = {
  title: "饿了么 | 美食娱乐站",
  description: "一个充满美食段子和趣味功能的美食娱乐网站",
  keywords: "美食,段子,娱乐,饿了么,美食推荐",
  authors: [{ name: "饿了么团队" }],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="zh-CN">
      <body
        className={`antialiased bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 min-h-screen font-sans`}
      >
        <div className="fixed inset-0 bg-gradient-to-br from-purple-900/20 via-blue-900/20 to-indigo-900/20 pointer-events-none" />
        <div className="relative z-10">
          {children}
        </div>
      </body>
    </html>
  );
}
