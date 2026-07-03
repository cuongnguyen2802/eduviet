"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { requireUser } from "@/lib/auth";
import { reviewSchema } from "@/lib/validations/review";

export async function submitReview(formData: FormData) {
  const user = await requireUser();

  const parsed = reviewSchema.safeParse({
    courseId: formData.get("courseId"),
    rating: formData.get("rating"),
    comment: formData.get("comment"),
  });
  if (!parsed.success) return { error: parsed.error.issues[0].message };

  const enrollment = await prisma.enrollment.findUnique({
    where: { userId_courseId: { userId: user.id, courseId: parsed.data.courseId } },
  });
  if (!enrollment) return { error: "Bạn cần mua khóa học trước khi đánh giá" };

  await prisma.review.upsert({
    where: { userId_courseId: { userId: user.id, courseId: parsed.data.courseId } },
    update: { rating: parsed.data.rating, comment: parsed.data.comment },
    create: { userId: user.id, ...parsed.data },
  });

  revalidatePath("/dashboard");
  revalidatePath("/courses/[slug]", "page");
  return { success: true };
}
