"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { requireUser } from "@/lib/auth";
import { z } from "zod";

const applicationSchema = z.object({
  headline: z.string().min(5, "Vui lòng nhập tiêu đề giới thiệu"),
  expertise: z.string().min(5, "Vui lòng mô tả chuyên môn của bạn"),
});

export async function submitInstructorApplication(formData: FormData) {
  const user = await requireUser();

  const parsed = applicationSchema.safeParse({
    headline: formData.get("headline"),
    expertise: formData.get("expertise"),
  });

  if (!parsed.success) {
    return { error: parsed.error.issues[0].message };
  }

  await prisma.instructorApplication.upsert({
    where: { userId: user.id },
    update: { ...parsed.data, status: "PENDING", submittedAt: new Date() },
    create: { userId: user.id, ...parsed.data },
  });

  revalidatePath("/become-instructor");
  return { success: true };
}
