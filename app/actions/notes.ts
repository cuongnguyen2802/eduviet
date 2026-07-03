"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { requireUser } from "@/lib/auth";

const noteSchema = z.object({
  lessonId: z.string().min(1),
  content: z.string().min(1, "Ghi chú không được để trống"),
  timestampSec: z.coerce.number().int().min(0).optional(),
});

export async function addLessonNote(courseId: string, formData: FormData) {
  const user = await requireUser();

  const parsed = noteSchema.safeParse({
    lessonId: formData.get("lessonId"),
    content: formData.get("content"),
    timestampSec: formData.get("timestampSec") || undefined,
  });
  if (!parsed.success) return { error: parsed.error.issues[0].message };

  await prisma.lessonNote.create({ data: { userId: user.id, ...parsed.data } });

  revalidatePath(`/learn/${courseId}/${parsed.data.lessonId}`);
  return { success: true };
}

export async function deleteLessonNote(courseId: string, lessonId: string, noteId: string) {
  const user = await requireUser();

  await prisma.lessonNote.deleteMany({ where: { id: noteId, userId: user.id } });

  revalidatePath(`/learn/${courseId}/${lessonId}`);
}
