import { cache } from "react";
import { prisma } from "@/lib/prisma";

export const SITE_SETTINGS_ID = "singleton";

const DEFAULT_FOOTER_DESCRIPTION =
  "Nền tảng học trực tuyến hàng đầu Việt Nam — mua trọn đời, học theo tốc độ của riêng bạn.";

/** Dùng cache() để Header/Footer/FloatingContactWidget chỉ tốn 1 query mỗi request dù đều gọi hàm này. */
export const getSiteSettings = cache(async () => {
  const settings = await prisma.siteSettings.findUnique({ where: { id: SITE_SETTINGS_ID } });

  return {
    logoUrl: settings?.logoUrl ?? null,
    footerDescription: settings?.footerDescription ?? DEFAULT_FOOTER_DESCRIPTION,
    socialFacebook: settings?.socialFacebook ?? null,
    socialYoutube: settings?.socialYoutube ?? null,
    socialZalo: settings?.socialZalo ?? null,
    hotlineEnabled: settings?.hotlineEnabled ?? false,
    hotlinePhone: settings?.hotlinePhone ?? null,
    chatWidgetEnabled: settings?.chatWidgetEnabled ?? false,
    zaloChatUrl: settings?.zaloChatUrl ?? null,
    messengerChatUrl: settings?.messengerChatUrl ?? null,
  };
});

export type SiteSettingsData = Awaited<ReturnType<typeof getSiteSettings>>;
