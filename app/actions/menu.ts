"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { requireRole } from "@/lib/auth";

const menuItemSchema = z.object({
  label: z.string().min(1, "Tên hiển thị không được để trống").max(50),
  url: z
    .string()
    .min(1, "Link không được để trống")
    .refine((v) => v.startsWith("/") || v.startsWith("http"), "Link phải bắt đầu bằng / hoặc http"),
});

function revalidateMenuPages() {
  revalidatePath("/admin/menu");
  revalidatePath("/");
}

export async function createMenuItem(formData: FormData) {
  await requireRole(["ADMIN"]);

  const parsed = menuItemSchema.safeParse({
    label: formData.get("label"),
    url: formData.get("url"),
  });
  if (!parsed.success) return { error: parsed.error.issues[0].message };

  const count = await prisma.menuItem.count();
  await prisma.menuItem.create({ data: { ...parsed.data, order: count + 1 } });
  revalidateMenuPages();
  return { success: true };
}

export async function updateMenuItem(id: string, formData: FormData) {
  await requireRole(["ADMIN"]);

  const parsed = menuItemSchema.safeParse({
    label: formData.get("label"),
    url: formData.get("url"),
  });
  if (!parsed.success) return { error: parsed.error.issues[0].message };

  await prisma.menuItem.update({ where: { id }, data: parsed.data });
  revalidateMenuPages();
  return { success: true };
}

export async function deleteMenuItem(id: string) {
  await requireRole(["ADMIN"]);
  await prisma.menuItem.delete({ where: { id } });
  revalidateMenuPages();
}

export async function toggleMenuItemActive(id: string, isActive: boolean) {
  await requireRole(["ADMIN"]);
  await prisma.menuItem.update({ where: { id }, data: { isActive } });
  revalidateMenuPages();
}

export async function moveMenuItem(id: string, direction: "up" | "down") {
  await requireRole(["ADMIN"]);

  const items = await prisma.menuItem.findMany({ orderBy: { order: "asc" } });
  const index = items.findIndex((i) => i.id === id);
  const swapIndex = direction === "up" ? index - 1 : index + 1;
  if (index === -1 || swapIndex < 0 || swapIndex >= items.length) return;

  const current = items[index];
  const swapWith = items[swapIndex];

  await prisma.$transaction([
    prisma.menuItem.update({ where: { id: current.id }, data: { order: swapWith.order } }),
    prisma.menuItem.update({ where: { id: swapWith.id }, data: { order: current.order } }),
  ]);
  revalidateMenuPages();
}
