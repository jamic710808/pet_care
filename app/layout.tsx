import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "泡泡爪 Pet Spa | 寵物洗護店",
  description:
    "泡泡爪 Pet Spa 為貓狗提供洗澡、精修、皮毛護理和幼寵適應服務。",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="zh-TW">
      <body>{children}</body>
    </html>
  );
}
