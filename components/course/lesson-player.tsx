"use client";

import { useTransition } from "react";
import { useRouter } from "next/navigation";
import { CheckCircle2 } from "lucide-react";
import { toast } from "sonner";
import { VideoPlayer } from "@/components/course/video-player";
import { Button } from "@/components/ui/button";
import { saveLessonPosition, markLessonComplete } from "@/app/actions/progress";

type Lesson = {
  id: string;
  title: string;
  type: "VIDEO" | "DOCUMENT" | "QUIZ";
  youtubeVideoId: string | null;
  content: string | null;
};

export function LessonPlayer({
  courseId,
  lesson,
  startAtSec,
  completed,
  nextLessonId,
}: {
  courseId: string;
  lesson: Lesson;
  startAtSec: number;
  completed: boolean;
  nextLessonId: string | null;
}) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  function handleComplete() {
    startTransition(async () => {
      await markLessonComplete(courseId, lesson.id);
      toast.success("Đã đánh dấu hoàn thành bài học");
      if (nextLessonId) router.push(`/learn/${courseId}/${nextLessonId}`);
    });
  }

  return (
    <div className="space-y-4">
      {lesson.type === "VIDEO" && lesson.youtubeVideoId ? (
        <VideoPlayer
          youtubeVideoId={lesson.youtubeVideoId}
          startAtSec={startAtSec}
          onProgress={(t) => saveLessonPosition(courseId, lesson.id, t)}
          onEnded={() => !completed && handleComplete()}
        />
      ) : (
        <div className="rounded-lg border p-6 whitespace-pre-wrap text-sm">
          {lesson.content ?? "Không có nội dung."}
        </div>
      )}

      <div className="flex items-center justify-between">
        <h1 className="text-xl font-semibold">{lesson.title}</h1>
        <Button onClick={handleComplete} disabled={completed || isPending} variant={completed ? "secondary" : "default"}>
          <CheckCircle2 className="mr-2 h-4 w-4" />
          {completed ? "Đã hoàn thành" : "Đánh dấu hoàn thành"}
        </Button>
      </div>
    </div>
  );
}
