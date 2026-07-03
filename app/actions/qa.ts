"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { requireUser } from "@/lib/auth";
import { answerSchema, questionSchema } from "@/lib/validations/review";

export async function askQuestion(courseId: string, formData: FormData) {
  const user = await requireUser();

  const parsed = questionSchema.safeParse({
    lessonId: formData.get("lessonId"),
    content: formData.get("content"),
  });
  if (!parsed.success) return { error: parsed.error.issues[0].message };

  await prisma.question.create({ data: { userId: user.id, ...parsed.data } });

  revalidatePath(`/learn/${courseId}/[lessonId]`, "page");
  return { success: true };
}

export async function answerQuestion(courseId: string, formData: FormData) {
  const user = await requireUser();

  const parsed = answerSchema.safeParse({
    questionId: formData.get("questionId"),
    content: formData.get("content"),
  });
  if (!parsed.success) return { error: parsed.error.issues[0].message };

  await prisma.answer.create({ data: { userId: user.id, ...parsed.data } });

  revalidatePath(`/learn/${courseId}/[lessonId]`, "page");
  revalidatePath(`/instructor/questions`);
  return { success: true };
}
