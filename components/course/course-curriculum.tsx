import { PlayCircle, FileText, HelpCircle, Lock } from "lucide-react";
import { formatDuration, formatTotalDuration } from "@/lib/format";

type Lesson = {
  id: string;
  title: string;
  type: "VIDEO" | "DOCUMENT" | "QUIZ";
  durationSec: number | null;
  isPreview: boolean;
};

type Section = {
  id: string;
  title: string;
  lessons: Lesson[];
};

const typeIcon = { VIDEO: PlayCircle, DOCUMENT: FileText, QUIZ: HelpCircle };

function sectionDuration(section: Section) {
  return section.lessons.reduce((sum, l) => sum + (l.durationSec ?? 0), 0);
}

export function CourseCurriculum({ sections }: { sections: Section[] }) {
  const totalLessons = sections.reduce((sum, s) => sum + s.lessons.length, 0);
  const totalDuration = sections.reduce((sum, s) => sum + sectionDuration(s), 0);

  return (
    <div className="rounded-lg border divide-y">
      <div className="p-4 bg-muted/50 flex items-center justify-between">
        <p className="font-semibold">Nội dung khóa học</p>
        <p className="text-sm text-muted-foreground">
          {sections.length} chương • {totalLessons} bài học
          {totalDuration > 0 && ` • ${formatTotalDuration(totalDuration)}`}
        </p>
      </div>
      {sections.map((section) => (
        <details key={section.id} className="group" open>
          <summary className="flex cursor-pointer list-none items-center justify-between p-4 font-medium hover:bg-muted/30">
            {section.title}
            <span className="text-sm text-muted-foreground font-normal">
              {section.lessons.length} bài
              {sectionDuration(section) > 0 && ` • ${formatTotalDuration(sectionDuration(section))}`}
            </span>
          </summary>
          <div className="divide-y border-t">
            {section.lessons.map((lesson) => {
              const Icon = typeIcon[lesson.type];
              return (
                <div key={lesson.id} className="flex items-center justify-between px-4 py-3 text-sm">
                  <div className="flex items-center gap-3">
                    <Icon className="h-4 w-4 text-muted-foreground shrink-0" />
                    <span>{lesson.title}</span>
                    {lesson.isPreview && (
                      <span className="text-xs text-primary font-medium">Xem trước</span>
                    )}
                  </div>
                  <div className="flex items-center gap-2 text-muted-foreground">
                    {lesson.durationSec ? <span>{formatDuration(lesson.durationSec)}</span> : null}
                    {!lesson.isPreview && <Lock className="h-3.5 w-3.5" />}
                  </div>
                </div>
              );
            })}
          </div>
        </details>
      ))}
    </div>
  );
}
