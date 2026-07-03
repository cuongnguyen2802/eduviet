"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { requireRole } from "@/lib/auth";
import { courseSchema, lessonSchema, sectionSchema } from "@/lib/validations/course";

function slugify(title: string) {
  return title
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/đ/g, "d")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

export async function createCourse(formData: FormData) {
  const instructor = await requireRole(["INSTRUCTOR", "ADMIN"]);

  const parsed = courseSchema.safeParse({
    title: formData.get("title"),
    description: formData.get("description"),
    price: formData.get("price"),
    categoryId: formData.get("categoryId"),
    level: formData.get("level"),
  });
  if (!parsed.success) return { error: parsed.error.issues[0].message };

  const baseSlug = slugify(parsed.data.title);
  const existingCount = await prisma.course.count({ where: { slug: { startsWith: baseSlug } } });
  const slug = existingCount > 0 ? `${baseSlug}-${existingCount + 1}` : baseSlug;

  const course = await prisma.course.create({
    data: { ...parsed.data, slug, instructorId: instructor.id },
  });

  redirect(`/instructor/courses/${course.id}/edit`);
}

export async function updateCourse(courseId: string, formData: FormData) {
  const instructor = await requireRole(["INSTRUCTOR", "ADMIN"]);

  const parsed = courseSchema.safeParse({
    title: formData.get("title"),
    description: formData.get("description"),
    price: formData.get("price"),
    discountPrice: formData.get("discountPrice") || null,
    categoryId: formData.get("categoryId"),
    level: formData.get("level"),
    coverImageUrl: formData.get("coverImageUrl") || "",
  });
  if (!parsed.success) return { error: parsed.error.issues[0].message };

  const course = await prisma.course.findUniqueOrThrow({ where: { id: courseId } });
  if (course.instructorId !== instructor.id && instructor.role !== "ADMIN") {
    return { error: "Bạn không có quyền chỉnh sửa khóa học này" };
  }

  const tagIds = formData.getAll("tagIds").map(String).filter(Boolean);

  await prisma.course.update({
    where: { id: courseId },
    data: {
      ...parsed.data,
      coverImageUrl: parsed.data.coverImageUrl || null,
      discountPrice: parsed.data.discountPrice ?? null,
      tags: { set: tagIds.map((id) => ({ id })) },
    },
  });

  revalidatePath(`/instructor/courses/${courseId}/edit`);
  return { success: true };
}

export async function submitCourseForReview(courseId: string) {
  const instructor = await requireRole(["INSTRUCTOR", "ADMIN"]);

  const course = await prisma.course.findUniqueOrThrow({
    where: { id: courseId },
    include: { sections: { include: { lessons: true } } },
  });
  if (course.instructorId !== instructor.id && instructor.role !== "ADMIN") {
    return { error: "Bạn không có quyền" };
  }
  if (course.sections.flatMap((s) => s.lessons).length === 0) {
    return { error: "Khóa học cần có ít nhất 1 bài học trước khi gửi duyệt" };
  }

  await prisma.course.update({ where: { id: courseId }, data: { status: "PENDING_REVIEW" } });
  revalidatePath(`/instructor/courses/${courseId}/edit`);
  revalidatePath("/instructor/courses");
  return { success: true };
}

export async function createSection(courseId: string, formData: FormData) {
  await requireRole(["INSTRUCTOR", "ADMIN"]);

  const count = await prisma.section.count({ where: { courseId } });
  const parsed = sectionSchema.safeParse({
    title: formData.get("title"),
    order: count + 1,
  });
  if (!parsed.success) return { error: parsed.error.issues[0].message };

  await prisma.section.create({ data: { ...parsed.data, courseId } });
  revalidatePath(`/instructor/courses/${courseId}/edit`);
  return { success: true };
}

export async function deleteSection(courseId: string, sectionId: string) {
  await requireRole(["INSTRUCTOR", "ADMIN"]);
  await prisma.section.delete({ where: { id: sectionId } });
  revalidatePath(`/instructor/courses/${courseId}/edit`);
}

export async function updateSection(courseId: string, sectionId: string, formData: FormData) {
  await requireRole(["INSTRUCTOR", "ADMIN"]);

  const parsed = z.object({ title: z.string().min(2, "Tên chương phải có ít nhất 2 ký tự") }).safeParse({
    title: formData.get("title"),
  });
  if (!parsed.success) return { error: parsed.error.issues[0].message };

  await prisma.section.update({ where: { id: sectionId }, data: { title: parsed.data.title } });
  revalidatePath(`/instructor/courses/${courseId}/edit`);
  return { success: true };
}

export async function moveSection(courseId: string, sectionId: string, direction: "up" | "down") {
  await requireRole(["INSTRUCTOR", "ADMIN"]);

  const sections = await prisma.section.findMany({ where: { courseId }, orderBy: { order: "asc" } });
  const index = sections.findIndex((s) => s.id === sectionId);
  const swapIndex = direction === "up" ? index - 1 : index + 1;
  if (index === -1 || swapIndex < 0 || swapIndex >= sections.length) return;

  const current = sections[index];
  const swapWith = sections[swapIndex];

  await prisma.$transaction([
    prisma.section.update({ where: { id: current.id }, data: { order: swapWith.order } }),
    prisma.section.update({ where: { id: swapWith.id }, data: { order: current.order } }),
  ]);
  revalidatePath(`/instructor/courses/${courseId}/edit`);
}

export async function createLesson(courseId: string, sectionId: string, formData: FormData) {
  await requireRole(["INSTRUCTOR", "ADMIN"]);

  const count = await prisma.lesson.count({ where: { sectionId } });
  const parsed = lessonSchema.safeParse({
    title: formData.get("title"),
    order: count + 1,
    type: formData.get("type"),
    youtubeVideoId: formData.get("youtubeVideoId") || undefined,
    content: formData.get("content") || undefined,
    durationSec: formData.get("durationSec") || undefined,
    isPreview: formData.get("isPreview") === "on",
  });
  if (!parsed.success) return { error: parsed.error.issues[0].message };

  await prisma.lesson.create({ data: { ...parsed.data, sectionId } });
  revalidatePath(`/instructor/courses/${courseId}/edit`);
  return { success: true };
}

export async function deleteLesson(courseId: string, lessonId: string) {
  await requireRole(["INSTRUCTOR", "ADMIN"]);
  await prisma.lesson.delete({ where: { id: lessonId } });
  revalidatePath(`/instructor/courses/${courseId}/edit`);
}

const lessonUpdateSchema = lessonSchema.omit({ order: true });

export async function updateLesson(courseId: string, lessonId: string, formData: FormData) {
  await requireRole(["INSTRUCTOR", "ADMIN"]);

  const parsed = lessonUpdateSchema.safeParse({
    title: formData.get("title"),
    type: formData.get("type"),
    youtubeVideoId: formData.get("youtubeVideoId") || undefined,
    content: formData.get("content") || undefined,
    durationSec: formData.get("durationSec") || undefined,
    isPreview: formData.get("isPreview") === "on",
  });
  if (!parsed.success) return { error: parsed.error.issues[0].message };

  await prisma.lesson.update({ where: { id: lessonId }, data: parsed.data });
  revalidatePath(`/instructor/courses/${courseId}/edit`);
  return { success: true };
}

export async function moveLesson(courseId: string, sectionId: string, lessonId: string, direction: "up" | "down") {
  await requireRole(["INSTRUCTOR", "ADMIN"]);

  const lessons = await prisma.lesson.findMany({ where: { sectionId }, orderBy: { order: "asc" } });
  const index = lessons.findIndex((l) => l.id === lessonId);
  const swapIndex = direction === "up" ? index - 1 : index + 1;
  if (index === -1 || swapIndex < 0 || swapIndex >= lessons.length) return;

  const current = lessons[index];
  const swapWith = lessons[swapIndex];

  await prisma.$transaction([
    prisma.lesson.update({ where: { id: current.id }, data: { order: swapWith.order } }),
    prisma.lesson.update({ where: { id: swapWith.id }, data: { order: current.order } }),
  ]);
  revalidatePath(`/instructor/courses/${courseId}/edit`);
}
