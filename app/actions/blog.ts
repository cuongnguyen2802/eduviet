"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { requireRole } from "@/lib/auth";

function slugify(title: string) {
  return title
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/đ/g, "d")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

const blogPostSchema = z.object({
  title: z.string().min(5, "Tiêu đề phải có ít nhất 5 ký tự"),
  slug: z
    .string()
    .regex(/^[a-z0-9]+(-[a-z0-9]+)*$/, "Slug chỉ được chứa chữ thường, số và dấu gạch ngang")
    .optional()
    .or(z.literal("")),
  excerpt: z.string().min(10, "Mô tả ngắn phải có ít nhất 10 ký tự").max(300),
  content: z.string().min(50, "Nội dung phải có ít nhất 50 ký tự"),
  coverImageUrl: z.string().url().optional().or(z.literal("")),
  status: z.enum(["DRAFT", "PUBLISHED"]),
  metaTitle: z.string().max(70).optional().or(z.literal("")),
  metaDescription: z.string().max(160).optional().or(z.literal("")),
});

function revalidateBlogPages(slug?: string) {
  revalidatePath("/admin/blog");
  revalidatePath("/blog");
  if (slug) revalidatePath(`/blog/${slug}`);
}

export async function createBlogPost(formData: FormData) {
  const author = await requireRole(["ADMIN"]);

  const parsed = blogPostSchema.safeParse({
    title: formData.get("title"),
    slug: formData.get("slug") || "",
    excerpt: formData.get("excerpt"),
    content: formData.get("content"),
    coverImageUrl: formData.get("coverImageUrl") || "",
    status: formData.get("status"),
    metaTitle: formData.get("metaTitle") || "",
    metaDescription: formData.get("metaDescription") || "",
  });
  if (!parsed.success) return { error: parsed.error.issues[0].message };

  const slug = parsed.data.slug || slugify(parsed.data.title);
  const existing = await prisma.blogPost.findUnique({ where: { slug } });
  if (existing) return { error: `Slug "${slug}" đã được dùng, vui lòng chọn slug khác` };

  const post = await prisma.blogPost.create({
    data: {
      title: parsed.data.title,
      slug,
      excerpt: parsed.data.excerpt,
      content: parsed.data.content,
      coverImageUrl: parsed.data.coverImageUrl || null,
      status: parsed.data.status,
      metaTitle: parsed.data.metaTitle || null,
      metaDescription: parsed.data.metaDescription || null,
      authorId: author.id,
      publishedAt: parsed.data.status === "PUBLISHED" ? new Date() : null,
    },
  });

  revalidateBlogPages(post.slug);
  redirect(`/admin/blog/${post.id}/edit`);
}

export async function updateBlogPost(postId: string, formData: FormData) {
  await requireRole(["ADMIN"]);

  const parsed = blogPostSchema.safeParse({
    title: formData.get("title"),
    slug: formData.get("slug") || "",
    excerpt: formData.get("excerpt"),
    content: formData.get("content"),
    coverImageUrl: formData.get("coverImageUrl") || "",
    status: formData.get("status"),
    metaTitle: formData.get("metaTitle") || "",
    metaDescription: formData.get("metaDescription") || "",
  });
  if (!parsed.success) return { error: parsed.error.issues[0].message };

  const current = await prisma.blogPost.findUniqueOrThrow({ where: { id: postId } });
  const slug = parsed.data.slug || slugify(parsed.data.title);
  const slugOwner = await prisma.blogPost.findUnique({ where: { slug } });
  if (slugOwner && slugOwner.id !== postId) {
    return { error: `Slug "${slug}" đã được dùng bởi bài viết khác` };
  }

  await prisma.blogPost.update({
    where: { id: postId },
    data: {
      title: parsed.data.title,
      slug,
      excerpt: parsed.data.excerpt,
      content: parsed.data.content,
      coverImageUrl: parsed.data.coverImageUrl || null,
      status: parsed.data.status,
      metaTitle: parsed.data.metaTitle || null,
      metaDescription: parsed.data.metaDescription || null,
      publishedAt: parsed.data.status === "PUBLISHED" ? current.publishedAt ?? new Date() : current.publishedAt,
    },
  });

  revalidateBlogPages(slug);
  if (current.slug !== slug) revalidateBlogPages(current.slug);
  return { success: true };
}

export async function deleteBlogPost(postId: string) {
  await requireRole(["ADMIN"]);
  const post = await prisma.blogPost.delete({ where: { id: postId } });
  revalidateBlogPages(post.slug);
}
