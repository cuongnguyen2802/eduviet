"use client";

import { useTransition } from "react";
import { toast } from "sonner";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { askQuestion, answerQuestion } from "@/app/actions/qa";

type Answer = { id: string; content: string; createdAt: Date; user: { name: string } };
type Question = { id: string; content: string; createdAt: Date; user: { name: string }; answers: Answer[] };

export function QASection({
  courseId,
  lessonId,
  questions,
  canAnswer,
}: {
  courseId: string;
  lessonId: string;
  questions: Question[];
  canAnswer: boolean;
}) {
  const [isPending, startTransition] = useTransition();

  function handleAsk(formData: FormData) {
    startTransition(async () => {
      const result = await askQuestion(courseId, formData);
      if (result?.error) toast.error(result.error);
      else toast.success("Đã gửi câu hỏi");
    });
  }

  function handleAnswer(formData: FormData) {
    startTransition(async () => {
      const result = await answerQuestion(courseId, formData);
      if (result?.error) toast.error(result.error);
      else toast.success("Đã trả lời câu hỏi");
    });
  }

  return (
    <section className="space-y-6">
      <h2 className="text-lg font-semibold">Hỏi đáp</h2>

      <form action={handleAsk} className="space-y-2">
        <input type="hidden" name="lessonId" value={lessonId} />
        <Textarea name="content" placeholder="Đặt câu hỏi về bài học này..." required />
        <Button type="submit" size="sm" disabled={isPending}>
          Gửi câu hỏi
        </Button>
      </form>

      <div className="space-y-4">
        {questions.map((q) => (
          <div key={q.id} className="border rounded-lg p-4 space-y-3">
            <div className="flex items-center gap-2">
              <Avatar className="h-7 w-7">
                <AvatarFallback>{q.user.name.slice(0, 2).toUpperCase()}</AvatarFallback>
              </Avatar>
              <p className="text-sm font-medium">{q.user.name}</p>
            </div>
            <p className="text-sm">{q.content}</p>

            {q.answers.length > 0 && (
              <div className="ml-6 space-y-2 border-l pl-4">
                {q.answers.map((a) => (
                  <div key={a.id}>
                    <p className="text-xs font-medium">{a.user.name}</p>
                    <p className="text-sm text-muted-foreground">{a.content}</p>
                  </div>
                ))}
              </div>
            )}

            {canAnswer && (
              <form action={handleAnswer} className="ml-6 flex gap-2">
                <input type="hidden" name="questionId" value={q.id} />
                <Textarea name="content" placeholder="Trả lời..." className="min-h-[40px]" required />
                <Button type="submit" size="sm" variant="outline" disabled={isPending}>
                  Trả lời
                </Button>
              </form>
            )}
          </div>
        ))}
        {questions.length === 0 && (
          <p className="text-sm text-muted-foreground">Chưa có câu hỏi nào cho bài học này.</p>
        )}
      </div>
    </section>
  );
}
