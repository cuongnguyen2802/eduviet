"use client";

import { useState, useTransition } from "react";
import { toast } from "sonner";
import { Trash2, PlayCircle, FileText, HelpCircle, Plus, Pencil, ChevronUp, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Card, CardContent } from "@/components/ui/card";
import {
  createSection,
  deleteSection,
  updateSection,
  moveSection,
  createLesson,
  updateLesson,
  deleteLesson,
  moveLesson,
} from "@/app/actions/course";

type Lesson = {
  id: string;
  title: string;
  type: "VIDEO" | "DOCUMENT" | "QUIZ";
  youtubeVideoId?: string | null;
  content?: string | null;
  durationSec?: number | null;
  isPreview: boolean;
};
type Section = { id: string; title: string; lessons: Lesson[] };

const typeIcon = { VIDEO: PlayCircle, DOCUMENT: FileText, QUIZ: HelpCircle };

function LessonFormFields({ defaultValues }: { defaultValues?: Lesson }) {
  const [type, setType] = useState<"VIDEO" | "DOCUMENT" | "QUIZ">(defaultValues?.type ?? "VIDEO");

  return (
    <>
      <div className="space-y-2">
        <Label htmlFor="lesson-title">Tiêu đề</Label>
        <Input id="lesson-title" name="title" defaultValue={defaultValues?.title} required />
      </div>
      <div className="space-y-2">
        <Label>Loại bài học</Label>
        <input type="hidden" name="type" value={type} />
        <Select value={type} onValueChange={(v) => setType(v as typeof type)}>
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="VIDEO">Video</SelectItem>
            <SelectItem value="DOCUMENT">Tài liệu</SelectItem>
            <SelectItem value="QUIZ">Quiz</SelectItem>
          </SelectContent>
        </Select>
      </div>
      {type === "VIDEO" ? (
        <>
          <div className="space-y-2">
            <Label htmlFor="youtubeVideoId">YouTube Video ID (Unlisted)</Label>
            <Input
              id="youtubeVideoId"
              name="youtubeVideoId"
              placeholder="vd: dQw4w9WgXcQ"
              defaultValue={defaultValues?.youtubeVideoId ?? ""}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="durationSec">Thời lượng (giây)</Label>
            <Input
              id="durationSec"
              name="durationSec"
              type="number"
              min={0}
              defaultValue={defaultValues?.durationSec ?? ""}
            />
          </div>
        </>
      ) : (
        <div className="space-y-2">
          <Label htmlFor="content">Nội dung</Label>
          <Textarea id="content" name="content" defaultValue={defaultValues?.content ?? ""} />
        </div>
      )}
      <label className="flex items-center gap-2 text-sm">
        <input type="checkbox" name="isPreview" className="h-4 w-4" defaultChecked={defaultValues?.isPreview} />
        Cho phép xem trước miễn phí
      </label>
    </>
  );
}

function AddLessonDialog({ courseId, sectionId }: { courseId: string; sectionId: string }) {
  const [open, setOpen] = useState(false);
  const [isPending, startTransition] = useTransition();

  function handleSubmit(formData: FormData) {
    startTransition(async () => {
      const result = await createLesson(courseId, sectionId, formData);
      if (result?.error) toast.error(result.error);
      else setOpen(false);
    });
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="ghost" size="sm">
          <Plus className="mr-1 h-4 w-4" /> Thêm bài học
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Thêm bài học</DialogTitle>
        </DialogHeader>
        <form action={handleSubmit} className="space-y-4">
          <LessonFormFields />
          <Button type="submit" disabled={isPending} className="w-full">
            {isPending ? "Đang thêm..." : "Thêm bài học"}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}

function EditLessonDialog({ courseId, lesson }: { courseId: string; lesson: Lesson }) {
  const [open, setOpen] = useState(false);
  const [isPending, startTransition] = useTransition();

  function handleSubmit(formData: FormData) {
    startTransition(async () => {
      const result = await updateLesson(courseId, lesson.id, formData);
      if (result?.error) toast.error(result.error);
      else {
        toast.success("Đã cập nhật bài học");
        setOpen(false);
      }
    });
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="ghost" size="icon" className="h-6 w-6">
          <Pencil className="h-3.5 w-3.5" />
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Sửa bài học</DialogTitle>
        </DialogHeader>
        <form action={handleSubmit} className="space-y-4">
          <LessonFormFields defaultValues={lesson} />
          <Button type="submit" disabled={isPending} className="w-full">
            {isPending ? "Đang lưu..." : "Lưu thay đổi"}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}

function EditSectionDialog({ courseId, section }: { courseId: string; section: Section }) {
  const [open, setOpen] = useState(false);
  const [isPending, startTransition] = useTransition();

  function handleSubmit(formData: FormData) {
    startTransition(async () => {
      const result = await updateSection(courseId, section.id, formData);
      if (result?.error) toast.error(result.error);
      else setOpen(false);
    });
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="ghost" size="icon">
          <Pencil className="h-4 w-4" />
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Sửa tên chương</DialogTitle>
        </DialogHeader>
        <form action={handleSubmit} className="space-y-4">
          <Input name="title" defaultValue={section.title} required />
          <Button type="submit" disabled={isPending} className="w-full">
            {isPending ? "Đang lưu..." : "Lưu thay đổi"}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}

export function CurriculumEditor({ courseId, sections }: { courseId: string; sections: Section[] }) {
  const [isPending, startTransition] = useTransition();

  function handleAddSection(formData: FormData) {
    startTransition(async () => {
      const result = await createSection(courseId, formData);
      if (result?.error) toast.error(result.error);
    });
  }

  return (
    <div className="space-y-4 max-w-2xl">
      {sections.map((section, sIndex) => (
        <Card key={section.id}>
          <CardContent className="p-4">
            <div className="flex items-center justify-between mb-3">
              <p className="font-semibold">{section.title}</p>
              <div className="flex items-center">
                <Button
                  variant="ghost"
                  size="icon"
                  disabled={sIndex === 0}
                  onClick={() => startTransition(() => moveSection(courseId, section.id, "up"))}
                >
                  <ChevronUp className="h-4 w-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  disabled={sIndex === sections.length - 1}
                  onClick={() => startTransition(() => moveSection(courseId, section.id, "down"))}
                >
                  <ChevronDown className="h-4 w-4" />
                </Button>
                <EditSectionDialog courseId={courseId} section={section} />
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => startTransition(() => deleteSection(courseId, section.id))}
                >
                  <Trash2 className="h-4 w-4 text-destructive" />
                </Button>
              </div>
            </div>
            <div className="space-y-1">
              {section.lessons.map((lesson, lIndex) => {
                const Icon = typeIcon[lesson.type];
                return (
                  <div key={lesson.id} className="flex items-center justify-between text-sm py-1.5 border-b last:border-0">
                    <div className="flex items-center gap-2">
                      <Icon className="h-4 w-4 text-muted-foreground" />
                      {lesson.title}
                      {lesson.isPreview && <span className="text-xs text-primary">(Xem trước)</span>}
                    </div>
                    <div className="flex items-center">
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-6 w-6"
                        disabled={lIndex === 0}
                        onClick={() => startTransition(() => moveLesson(courseId, section.id, lesson.id, "up"))}
                      >
                        <ChevronUp className="h-3.5 w-3.5" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-6 w-6"
                        disabled={lIndex === section.lessons.length - 1}
                        onClick={() => startTransition(() => moveLesson(courseId, section.id, lesson.id, "down"))}
                      >
                        <ChevronDown className="h-3.5 w-3.5" />
                      </Button>
                      <EditLessonDialog courseId={courseId} lesson={lesson} />
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-6 w-6"
                        onClick={() => startTransition(() => deleteLesson(courseId, lesson.id))}
                      >
                        <Trash2 className="h-3.5 w-3.5 text-destructive" />
                      </Button>
                    </div>
                  </div>
                );
              })}
            </div>
            <AddLessonDialog courseId={courseId} sectionId={section.id} />
          </CardContent>
        </Card>
      ))}

      <form action={handleAddSection} className="flex gap-2">
        <Input name="title" placeholder="Tên chương mới" required />
        <Button type="submit" disabled={isPending}>
          Thêm chương
        </Button>
      </form>
    </div>
  );
}
