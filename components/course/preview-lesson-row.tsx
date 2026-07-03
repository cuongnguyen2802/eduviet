"use client";

import { useState } from "react";
import { PlayCircle, FileText, HelpCircle } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { VideoPlayer } from "@/components/course/video-player";

const typeIcon = { VIDEO: PlayCircle, DOCUMENT: FileText, QUIZ: HelpCircle };

export function PreviewLessonRow({
  title,
  type,
  youtubeVideoId,
  durationLabel,
}: {
  title: string;
  type: "VIDEO" | "DOCUMENT" | "QUIZ";
  youtubeVideoId: string;
  durationLabel: string | null;
}) {
  const [open, setOpen] = useState(false);
  const Icon = typeIcon[type];

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="flex w-full items-center justify-between px-4 py-3 text-sm text-left hover:bg-muted/30"
      >
        <div className="flex items-center gap-3">
          <Icon className="h-4 w-4 text-muted-foreground shrink-0" />
          <span>{title}</span>
          <span className="text-xs font-medium text-primary underline underline-offset-2">Xem trước</span>
        </div>
        {durationLabel && <span className="text-muted-foreground">{durationLabel}</span>}
      </button>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>{title}</DialogTitle>
          </DialogHeader>
          <VideoPlayer youtubeVideoId={youtubeVideoId} />
        </DialogContent>
      </Dialog>
    </>
  );
}
