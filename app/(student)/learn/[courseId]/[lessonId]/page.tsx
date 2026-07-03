import { notFound } from "next/navigation";
import { requireUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { LessonSidebar } from "@/components/course/lesson-sidebar";
import { LessonPlayer } from "@/components/course/lesson-player";
import { QASection } from "@/components/course/qa-section";
import { LessonNotes } from "@/components/course/lesson-notes";

export default async function LessonPage({
  params,
}: {
  params: { courseId: string; lessonId: string };
}) {
  const user = await requireUser();

  const enrollment = await prisma.enrollment.findUnique({
    where: { userId_courseId: { userId: user.id, courseId: params.courseId } },
    include: {
      course: {
        include: {
          sections: { orderBy: { order: "asc" }, include: { lessons: { orderBy: { order: "asc" } } } },
        },
      },
      lessonProgress: true,
    },
  });
  if (!enrollment) notFound();

  const allLessons = enrollment.course.sections.flatMap((s) => s.lessons);
  const lessonIndex = allLessons.findIndex((l) => l.id === params.lessonId);
  const lesson = allLessons[lessonIndex];
  if (!lesson) notFound();

  const nextLessonId = allLessons[lessonIndex + 1]?.id ?? null;
  const currentProgress = enrollment.lessonProgress.find((p) => p.lessonId === lesson.id);
  const completedLessonIds = enrollment.lessonProgress.filter((p) => p.completed).map((p) => p.lessonId);

  const questions = await prisma.question.findMany({
    where: { lessonId: lesson.id },
    include: { user: true, answers: { include: { user: true }, orderBy: { createdAt: "asc" } } },
    orderBy: { createdAt: "desc" },
  });

  const canAnswer = user.id === enrollment.course.instructorId || user.role === "ADMIN";

  const notes = await prisma.lessonNote.findMany({
    where: { lessonId: lesson.id, userId: user.id },
    orderBy: { createdAt: "desc" },
  });

  return (
    <>
      <LessonSidebar
        courseId={params.courseId}
        sections={enrollment.course.sections}
        completedLessonIds={completedLessonIds}
      />
      <main className="flex-1 overflow-y-auto p-6 max-w-4xl mx-auto space-y-10">
        <LessonPlayer
          courseId={params.courseId}
          lesson={lesson}
          startAtSec={currentProgress?.lastPositionSec ?? 0}
          completed={currentProgress?.completed ?? false}
          nextLessonId={nextLessonId}
        />
        <LessonNotes courseId={params.courseId} lessonId={lesson.id} notes={notes} />
        <QASection
          courseId={params.courseId}
          lessonId={lesson.id}
          questions={questions}
          canAnswer={canAnswer}
        />
      </main>
    </>
  );
}
