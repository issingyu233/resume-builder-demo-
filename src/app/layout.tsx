import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "智能简历定制",
  description: "根据JD自动改写简历",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="zh-CN">
      <body className="antialiased">{children}</body>
    </html>
  );
}
