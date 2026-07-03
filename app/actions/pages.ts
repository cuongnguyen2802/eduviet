"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";
import type { Prisma } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { requireRole } from "@/lib/auth";
import type { PageBlock } from "@/lib/blocks";

function slugify(title: string) {
  return title
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/đ/g, "d")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

function revalidatePageRoutes(slug: string, isSystemPage: boolean) {
  revalidatePath("/admin/pages");
  if (isSystemPage) revalidatePath("/");
  else revalidatePath(`/${slug}`);
}

export async function createPage(input: { title: string; slug?: string }) {
  await requireRole(["ADMIN"]);

  const title = input.title.trim();
  if (title.length < 2) return { error: "Tiêu đề phải có ít nhất 2 ký tự" };

  const slug = slugify(input.slug?.trim() || title);
  if (!slug) return { error: "Slug không hợp lệ" };

  const existing = await prisma.page.findUnique({ where: { slug } });
  if (existing) return { error: `Slug "${slug}" đã được dùng, vui lòng chọn slug khác` };

  const page = await prisma.page.create({ data: { title, slug, blocks: [] } });

  revalidatePath("/admin/pages");
  redirect(`/admin/pages/${page.id}/edit`);
}

const metaSchema = z.object({
  title: z.string().min(2, "Tiêu đề phải có ít nhất 2 ký tự"),
  slug: z.string().regex(/^[a-z0-9]+(-[a-z0-9]+)*$/, "Slug chỉ được chứa chữ thường, số và dấu gạch ngang"),
  status: z.enum(["DRAFT", "PUBLISHED"]),
  metaTitle: z.string().max(70).optional().or(z.literal("")),
  metaDescription: z.string().max(160).optional().or(z.literal("")),
});

export async function updatePageMeta(
  pageId: string,
  input: { title: string; slug: string; status: "DRAFT" | "PUBLISHED"; metaTitle?: string; metaDescription?: string }
) {
  await requireRole(["ADMIN"]);

  const parsed = metaSchema.safeParse(input);
  if (!parsed.success) return { error: parsed.error.issues[0].message };

  const current = await prisma.page.findUniqueOrThrow({ where: { id: pageId } });
  // Trang hệ thống (trang-chu, gioi-thieu, lien-he) giữ nguyên slug để không phá liên kết cố định.
  const slug = current.isSystemPage ? current.slug : parsed.data.slug;

  if (!current.isSystemPage) {
    const slugOwner = await prisma.page.findUnique({ where: { slug } });
    if (slugOwner && slugOwner.id !== pageId) return { error: `Slug "${slug}" đã được dùng bởi trang khác` };
  }

  await prisma.page.update({
    where: { id: pageId },
    data: {
      title: parsed.data.title,
      slug,
      status: parsed.data.status,
      metaTitle: parsed.data.metaTitle || null,
      metaDescription: parsed.data.metaDescription || null,
    },
  });

  revalidatePageRoutes(slug, current.isSystemPage);
  if (current.slug !== slug) revalidatePageRoutes(current.slug, current.isSystemPage);
  return { success: true, slug };
}

export async function updatePageBlocks(pageId: string, blocks: PageBlock[]) {
  await requireRole(["ADMIN"]);

  const page = await prisma.page.update({
    where: { id: pageId },
    data: { blocks: blocks as unknown as Prisma.InputJsonValue },
  });

  revalidatePageRoutes(page.slug, page.isSystemPage);
  return { success: true };
}

export async function deletePage(pageId: string) {
  await requireRole(["ADMIN"]);

  const page = await prisma.page.findUniqueOrThrow({ where: { id: pageId } });
  if (page.isSystemPage) return { error: "Không thể xóa trang hệ thống" };

  await prisma.page.delete({ where: { id: pageId } });
  revalidatePath("/admin/pages");
  revalidatePath(`/${page.slug}`);
  return { success: true };
}
