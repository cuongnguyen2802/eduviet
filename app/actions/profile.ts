"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { requireUser } from "@/lib/auth";

const profileSchema = z.object({
  name: z.string().min(2, "Họ tên phải có ít nhất 2 ký tự"),
  bio: z.string().max(500).optional(),
  avatarUrl: z.string().url().optional().or(z.literal("")),
});

export async function updateProfile(formData: FormData) {
  const user = await requireUser();

  const parsed = profileSchema.safeParse({
    name: formData.get("name"),
    bio: formData.get("bio"),
    avatarUrl: formData.get("avatarUrl") || "",
  });

  if (!parsed.success) {
    return { error: parsed.error.issues[0].message };
  }

  await prisma.user.update({
    where: { id: user.id },
    data: { ...parsed.data, avatarUrl: parsed.data.avatarUrl || null },
  });

  revalidatePath("/dashboard/profile");
  return { success: true };
}
