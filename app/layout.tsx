import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { Toaster } from "sonner";
import { getSiteSettings } from "@/lib/site-settings";
import { FloatingContactWidget } from "@/components/layout/floating-contact-widget";
import "./globals.css";

const inter = Inter({ subsets: ["latin", "vietnamese"] });

export const metadata: Metadata = {
  title: "EduViet — Học trực tuyến trọn đời",
  description: "Marketplace khóa học video online dành cho thị trường Việt Nam.",
};

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const settings = await getSiteSettings();

  return (
    <html lang="vi">
      <body className={inter.className}>
        {children}
        <Toaster richColors position="top-center" />
        <FloatingContactWidget
          hotlineEnabled={settings.hotlineEnabled}
          hotlinePhone={settings.hotlinePhone}
          chatWidgetEnabled={settings.chatWidgetEnabled}
          zaloChatUrl={settings.zaloChatUrl}
          messengerChatUrl={settings.messengerChatUrl}
        />
      </body>
    </html>
  );
}
