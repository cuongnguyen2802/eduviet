"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { CheckCircle2, Circle, PlayCircle, FileText, HelpCircle } from "lucide-react";
import { cn } from "@/lib/utils";
import { formatDuration } from "@/lib/format";

type Lesson = {
  id: string;
  title: string;
  type: "VIDEO" | "DOCUMENT" | "QUIZ";
  durationSec: number | null;
};

type Section = { id: string; title: string; lessons: Lesson[] };

const typeIcon = { VIDEO: PlayCircle, DOCUMENT: FileText, QUIZ: HelpCircle };

export function LessonSidebar({
  courseId,
  sections,
  completedLessonIds,
}: {
  courseId: string;
  sections: Section[];
  completedLessonIds: string[];
}) {
  const pathname = usePathname();
  const completed = new Set(completedLessonIds);

  return (
    <aside className="w-80 shrink-0 border-r overflow-y-auto max-h-[calc(100vh-3.5rem)]">
      {sections.map((section) => (
        <div key={section.id}>
          <p className="px-4 py-3 text-sm font-semibold bg-muted/40">{section.title}</p>
          {section.lessons.map((lesson) => {
            const Icon = typeIcon[lesson.type];
            const active = pathname === `/learn/${courseId}/${lesson.id}`;
            const done = completed.has(lesson.id);

            return (
              <Link
                key={lesson.id}
                href={`/learn/${courseId}/${lesson.id}`}
                className={cn(
                  "flex items-center gap-2 px-4 py-3 text-sm border-b hover:bg-accent",
                  active && "bg-accent"
                )}
              >
                {done ? (
                  <CheckCircle2 className="h-4 w-4 text-primary shrink-0" />
                ) : (
                  <Circle className="h-4 w-4 text-muted-foreground shrink-0" />
                )}
                <Icon className="h-4 w-4 text-muted-foreground shrink-0" />
                <span className="flex-1 line-clamp-2">{lesson.title}</span>
                {lesson.durationSec ? (
                  <span className="text-xs text-muted-foreground shrink-0">
                    {formatDuration(lesson.durationSec)}
                  </span>
                ) : null}
              </Link>
            );
          })}
        </div>
      ))}
    </aside>
  );
}
