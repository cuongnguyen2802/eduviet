"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { requireRole } from "@/lib/auth";
import { sendInstructorApplicationResultEmail } from "@/lib/email";
import { refundOrder } from "@/lib/orders";
import type { Role } from "@prisma/client";

export async function refundOrderAction(orderId: string) {
  await requireRole(["ADMIN"]);
  const result = await refundOrder(orderId);
  revalidatePath("/admin/orders");
  revalidatePath("/dashboard/orders");
  return result;
}

export async function approveCourse(courseId: string) {
  await requireRole(["ADMIN"]);
  await prisma.course.update({ where: { id: courseId }, data: { status: "PUBLISHED", rejectReason: null } });
  revalidatePath("/admin/courses");
}

export async function rejectCourse(courseId: string, reason: string) {
  await requireRole(["ADMIN"]);
  await prisma.course.update({ where: { id: courseId }, data: { status: "REJECTED", rejectReason: reason } });
  revalidatePath("/admin/courses");
}

export async function updateUserRole(userId: string, role: Role) {
  const admin = await requireRole(["ADMIN"]);
  if (admin.id === userId && role !== "ADMIN") {
    return { error: "Không thể tự đổi vai trò của chính mình khỏi Admin" };
  }
  await prisma.user.update({ where: { id: userId }, data: { role } });
  revalidatePath("/admin/users");
  return { success: true };
}

export async function toggleUserBan(userId: string, isBanned: boolean) {
  const admin = await requireRole(["ADMIN"]);
  if (admin.id === userId) return { error: "Không thể tự khóa tài khoản của chính mình" };

  await prisma.user.update({ where: { id: userId }, data: { isBanned } });
  revalidatePath("/admin/users");
  return { success: true };
}

export async function updateRevenueSharePct(userId: string, pct: number) {
  await requireRole(["ADMIN"]);
  if (pct < 0 || pct > 100) return { error: "Tỷ lệ phải trong khoảng 0-100" };
  await prisma.user.update({ where: { id: userId }, data: { revenueSharePct: pct } });
  revalidatePath("/admin/users");
  return { success: true };
}

const couponSchema = z.object({
  code: z.string().min(3).toUpperCase(),
  discountPct: z.coerce.number().int().min(1).max(100),
  maxUses: z.coerce.number().int().min(1).optional(),
});

export async function createCoupon(formData: FormData) {
  await requireRole(["ADMIN"]);

  const parsed = couponSchema.safeParse({
    code: formData.get("code"),
    discountPct: formData.get("discountPct"),
    maxUses: formData.get("maxUses") || undefined,
  });
  if (!parsed.success) return { error: parsed.error.issues[0].message };

  await prisma.coupon.create({ data: parsed.data });
  revalidatePath("/admin/coupons");
  return { success: true };
}

export async function toggleCouponActive(couponId: string, isActive: boolean) {
  await requireRole(["ADMIN"]);
  await prisma.coupon.update({ where: { id: couponId }, data: { isActive } });
  revalidatePath("/admin/coupons");
}

export async function reviewInstructorApplication(applicationId: string, approve: boolean) {
  await requireRole(["ADMIN"]);

  const application = await prisma.instructorApplication.update({
    where: { id: applicationId },
    data: { status: approve ? "APPROVED" : "REJECTED", reviewedAt: new Date() },
  });

  if (approve) {
    await prisma.user.update({ where: { id: application.userId }, data: { role: "INSTRUCTOR" } });
  }

  const applicant = await prisma.user.findUniqueOrThrow({ where: { id: application.userId } });
  await sendInstructorApplicationResultEmail({ to: applicant.email, name: applicant.name, approved: approve });

  revalidatePath("/admin/instructor-applications");
}

const nameSchema = z.object({
  name: z.string().min(2, "Tên phải có ít nhất 2 ký tự"),
});

export const CATEGORY_ICONS = ["Briefcase", "TrendingUp", "Palette", "Monitor", "Languages"] as const;

const slugField = z
  .string()
  .regex(/^[a-z0-9]+(-[a-z0-9]+)*$/, "Slug chỉ được chứa chữ thường, số và dấu gạch ngang (vd: marketing-so)")
  .optional()
  .or(z.literal(""));

const categoryDetailsSchema = z.object({
  name: z.string().min(2, "Tên phải có ít nhất 2 ký tự"),
  slug: slugField,
  icon: z.enum(CATEGORY_ICONS).optional().or(z.literal("")),
  description: z.string().max(500, "Mô tả tối đa 500 ký tự").optional().or(z.literal("")),
  metaTitle: z.string().max(70, "SEO title tối đa 70 ký tự").optional().or(z.literal("")),
});

function slugify(name: string) {
  return name
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/đ/g, "d")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

function revalidateCategoryPages() {
  revalidatePath("/admin/categories");
  revalidatePath("/");
  revalidatePath("/courses");
}

export async function createCategory(formData: FormData) {
  await requireRole(["ADMIN"]);

  const parsed = z
    .object({ name: z.string().min(2, "Tên phải có ít nhất 2 ký tự"), slug: slugField })
    .safeParse({ name: formData.get("name"), slug: formData.get("slug") || "" });
  if (!parsed.success) return { error: parsed.error.issues[0].message };

  const slug = parsed.data.slug || slugify(parsed.data.name);
  const existing = await prisma.category.findUnique({ where: { slug } });
  if (existing) return { error: `Slug "${slug}" đã được dùng, vui lòng chọn slug khác` };

  const parentId = formData.get("parentId");

  await prisma.category.create({
    data: {
      name: parsed.data.name,
      slug,
      parentId: typeof parentId === "string" && parentId ? parentId : null,
    },
  });
  revalidateCategoryPages();
  return { success: true };
}

export async function updateCategory(categoryId: string, formData: FormData) {
  await requireRole(["ADMIN"]);

  const parsed = categoryDetailsSchema.safeParse({
    name: formData.get("name"),
    slug: formData.get("slug") || "",
    icon: formData.get("icon") || "",
    description: formData.get("description") || "",
    metaTitle: formData.get("metaTitle") || "",
  });
  if (!parsed.success) return { error: parsed.error.issues[0].message };

  const parentIdRaw = formData.get("parentId");
  const parentId = typeof parentIdRaw === "string" && parentIdRaw ? parentIdRaw : null;

  if (parentId) {
    if (parentId === categoryId) return { error: "Danh mục không thể là cha của chính nó" };
    const parent = await prisma.category.findUnique({ where: { id: parentId } });
    if (!parent) return { error: "Danh mục cha không tồn tại" };
    if (parent.parentId) return { error: "Chỉ hỗ trợ tối đa 2 cấp danh mục — không thể chọn danh mục con làm cha" };
    const hasChildren = await prisma.category.count({ where: { parentId: categoryId } });
    if (hasChildren > 0) return { error: "Danh mục này đang có danh mục con, không thể biến nó thành danh mục con" };
  }

  const slug = parsed.data.slug || slugify(parsed.data.name);
  const slugOwner = await prisma.category.findUnique({ where: { slug } });
  if (slugOwner && slugOwner.id !== categoryId) {
    return { error: `Slug "${slug}" đã được dùng bởi danh mục khác` };
  }

  await prisma.category.update({
    where: { id: categoryId },
    data: {
      name: parsed.data.name,
      slug,
      icon: parsed.data.icon || null,
      description: parsed.data.description || null,
      metaTitle: parsed.data.metaTitle || null,
      parentId,
    },
  });
  revalidateCategoryPages();
  return { success: true };
}

export async function deleteCategory(categoryId: string) {
  await requireRole(["ADMIN"]);
  await prisma.category.delete({ where: { id: categoryId } });
  revalidateCategoryPages();
}

export async function createTag(formData: FormData) {
  await requireRole(["ADMIN"]);

  const parsed = nameSchema.safeParse({ name: formData.get("name") });
  if (!parsed.success) return { error: parsed.error.issues[0].message };

  await prisma.tag.create({ data: { name: parsed.data.name, slug: slugify(parsed.data.name) } });
  revalidatePath("/admin/tags");
  return { success: true };
}

export async function deleteTag(tagId: string) {
  await requireRole(["ADMIN"]);
  await prisma.tag.delete({ where: { id: tagId } });
  revalidatePath("/admin/tags");
}
