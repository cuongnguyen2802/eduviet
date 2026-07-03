"use client";

import { useTransition } from "react";
import { Trash2, StickyNote } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { formatDuration } from "@/lib/format";
import { addLessonNote, deleteLessonNote } from "@/app/actions/notes";

type Note = { id: string; content: string; timestampSec: number | null; createdAt: Date };

export function LessonNotes({ courseId, lessonId, notes }: { courseId: string; lessonId: string; notes: Note[] }) {
  const [isPending, startTransition] = useTransition();

  function handleAdd(formData: FormData) {
    startTransition(async () => {
      const result = await addLessonNote(courseId, formData);
      if (result?.error) toast.error(result.error);
    });
  }

  return (
    <section className="space-y-4">
      <h2 className="text-lg font-semibold flex items-center gap-2">
        <StickyNote className="h-5 w-5" /> Ghi chú của tôi
      </h2>

      <form action={handleAdd} className="space-y-2">
        <input type="hidden" name="lessonId" value={lessonId} />
        <Textarea name="content" placeholder="Ghi chú lại điều bạn học được từ bài này..." required />
        <Button type="submit" size="sm" disabled={isPending}>
          Lưu ghi chú
        </Button>
      </form>

      <div className="space-y-2">
        {notes.map((note) => (
          <div key={note.id} className="flex items-start justify-between gap-3 rounded-lg border p-3">
            <div>
              {note.timestampSec !== null && (
                <p className="text-xs font-medium text-primary mb-1">{formatDuration(note.timestampSec)}</p>
              )}
              <p className="text-sm whitespace-pre-wrap">{note.content}</p>
            </div>
            <Button
              variant="ghost"
              size="icon"
              className="h-7 w-7 shrink-0"
              disabled={isPending}
              onClick={() => startTransition(() => deleteLessonNote(courseId, lessonId, note.id))}
            >
              <Trash2 className="h-3.5 w-3.5 text-destructive" />
            </Button>
          </div>
        ))}
        {notes.length === 0 && <p className="text-sm text-muted-foreground">Bạn chưa có ghi chú nào cho bài học này.</p>}
      </div>
    </section>
  );
}
