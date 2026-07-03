import { notFound, redirect } from "next/navigation";
import { requireUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export default async function LearnCourseIndexPage({ params }: { params: { courseId: string } }) {
  const user = await requireUser();

  const enrollment = await prisma.enrollment.findUnique({
    where: { userId_courseId: { userId: user.id, courseId: params.courseId } },
    include: {
      course: {
        include: { sections: { orderBy: { order: "asc" }, include: { lessons: { orderBy: { order: "asc" } } } } },
      },
      lessonProgress: true,
    },
  });

  if (!enrollment) notFound();

  const allLessons = enrollment.course.sections.flatMap((s) => s.lessons);
  const completedIds = new Set(
    enrollment.lessonProgress.filter((p) => p.completed).map((p) => p.lessonId)
  );
  const nextLesson = allLessons.find((l) => !completedIds.has(l.id)) ?? allLessons[0];

  if (!nextLesson) notFound();

  redirect(`/learn/${params.courseId}/${nextLesson.id}`);
}
