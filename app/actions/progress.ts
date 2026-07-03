"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { requireUser } from "@/lib/auth";

async function recalcEnrollmentProgress(enrollmentId: string) {
  const enrollment = await prisma.enrollment.findUniqueOrThrow({
    where: { id: enrollmentId },
    include: { course: { include: { sections: { include: { lessons: true } } } } },
  });

  const totalLessons = enrollment.course.sections.reduce((sum, s) => sum + s.lessons.length, 0);
  const completedCount = await prisma.lessonProgress.count({
    where: { enrollmentId, completed: true },
  });

  const progressPct = totalLessons > 0 ? Math.round((completedCount / totalLessons) * 100) : 0;

  await prisma.enrollment.update({
    where: { id: enrollmentId },
    data: {
      progressPct,
      completedAt: progressPct === 100 ? new Date() : null,
    },
  });

  return progressPct;
}

/** Lưu vị trí xem hiện tại (gọi định kỳ từ VideoPlayer.onProgress) */
export async function saveLessonPosition(courseId: string, lessonId: string, positionSec: number) {
  const user = await requireUser();
  const enrollment = await prisma.enrollment.findUniqueOrThrow({
    where: { userId_courseId: { userId: user.id, courseId } },
  });

  await prisma.lessonProgress.upsert({
    where: { enrollmentId_lessonId: { enrollmentId: enrollment.id, lessonId } },
    update: { lastPositionSec: positionSec },
    create: { enrollmentId: enrollment.id, lessonId, lastPositionSec: positionSec },
  });
}

/** Đánh dấu bài học đã hoàn thành (gọi khi video kết thúc hoặc học viên tự đánh dấu) */
export async function markLessonComplete(courseId: string, lessonId: string) {
  const user = await requireUser();
  const enrollment = await prisma.enrollment.findUniqueOrThrow({
    where: { userId_courseId: { userId: user.id, courseId } },
  });

  await prisma.lessonProgress.upsert({
    where: { enrollmentId_lessonId: { enrollmentId: enrollment.id, lessonId } },
    update: { completed: true },
    create: { enrollmentId: enrollment.id, lessonId, completed: true },
  });

  const progressPct = await recalcEnrollmentProgress(enrollment.id);
  revalidatePath(`/learn/${courseId}`);
  revalidatePath("/dashboard");
  return { progressPct };
}
