import Link from "next/link";
import { requireRole } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export default async function InstructorQuestionsPage() {
  const instructor = await requireRole(["INSTRUCTOR", "ADMIN"]);

  const questions = await prisma.question.findMany({
    where: { lesson: { section: { course: { instructorId: instructor.id } } } },
    include: {
      user: true,
      answers: true,
      lesson: { include: { section: { include: { course: true } } } },
    },
    orderBy: { createdAt: "desc" },
    take: 50,
  });

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Câu hỏi học viên</h1>
      <div className="space-y-3">
        {questions.map((q) => (
          <Link
            key={q.id}
            href={`/learn/${q.lesson.section.course.id}/${q.lessonId}`}
          >
            <Card className="hover:border-primary transition-colors">
              <CardContent className="p-4">
                <div className="flex items-center justify-between mb-1">
                  <p className="text-sm font-medium">{q.user.name}</p>
                  {q.answers.length === 0 && <Badge variant="secondary">Chưa trả lời</Badge>}
                </div>
                <p className="text-sm">{q.content}</p>
                <p className="text-xs text-muted-foreground mt-2">
                  {q.lesson.section.course.title} • {q.lesson.title}
                </p>
              </CardContent>
            </Card>
          </Link>
        ))}
        {questions.length === 0 && (
          <p className="text-muted-foreground text-center py-12">Chưa có câu hỏi nào từ học viên.</p>
        )}
      </div>
    </div>
  );
}
