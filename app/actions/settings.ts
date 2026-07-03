"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { requireRole } from "@/lib/auth";
import { SITE_SETTINGS_ID } from "@/lib/site-settings";

const urlField = z.string().url().optional().or(z.literal(""));

const settingsSchema = z.object({
  logoUrl: urlField,
  footerDescription: z.string().max(300).optional().or(z.literal("")),
  socialFacebook: urlField,
  socialYoutube: urlField,
  socialZalo: urlField,
  hotlineEnabled: z.boolean(),
  hotlinePhone: z.string().max(20).optional().or(z.literal("")),
  chatWidgetEnabled: z.boolean(),
  zaloChatUrl: urlField,
  messengerChatUrl: urlField,
});

export type SettingsInput = z.infer<typeof settingsSchema>;

export async function updateSiteSettings(input: SettingsInput) {
  await requireRole(["ADMIN"]);

  const parsed = settingsSchema.safeParse(input);
  if (!parsed.success) return { error: parsed.error.issues[0].message };

  const d = parsed.data;
  await prisma.siteSettings.upsert({
    where: { id: SITE_SETTINGS_ID },
    update: {
      logoUrl: d.logoUrl || null,
      footerDescription: d.footerDescription || null,
      socialFacebook: d.socialFacebook || null,
      socialYoutube: d.socialYoutube || null,
      socialZalo: d.socialZalo || null,
      hotlineEnabled: d.hotlineEnabled,
      hotlinePhone: d.hotlinePhone || null,
      chatWidgetEnabled: d.chatWidgetEnabled,
      zaloChatUrl: d.zaloChatUrl || null,
      messengerChatUrl: d.messengerChatUrl || null,
    },
    create: {
      id: SITE_SETTINGS_ID,
      logoUrl: d.logoUrl || null,
      footerDescription: d.footerDescription || null,
      socialFacebook: d.socialFacebook || null,
      socialYoutube: d.socialYoutube || null,
      socialZalo: d.socialZalo || null,
      hotlineEnabled: d.hotlineEnabled,
      hotlinePhone: d.hotlinePhone || null,
      chatWidgetEnabled: d.chatWidgetEnabled,
      zaloChatUrl: d.zaloChatUrl || null,
      messengerChatUrl: d.messengerChatUrl || null,
    },
  });

  revalidatePath("/", "layout");
  return { success: true };
}
