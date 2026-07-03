"use client";

import { useState, useTransition } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { approveCourse, rejectCourse } from "@/app/actions/admin";

export function CourseReviewActions({ courseId }: { courseId: string }) {
  const [open, setOpen] = useState(false);
  const [reason, setReason] = useState("");
  const [isPending, startTransition] = useTransition();

  return (
    <div className="flex gap-2">
      <Button
        size="sm"
        disabled={isPending}
        onClick={() =>
          startTransition(async () => {
            await approveCourse(courseId);
            toast.success("Đã duyệt khóa học");
          })
        }
      >
        Duyệt
      </Button>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
          <Button size="sm" variant="destructive">
            Từ chối
          </Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Từ chối khóa học</DialogTitle>
          </DialogHeader>
          <Textarea
            placeholder="Lý do từ chối..."
            value={reason}
            onChange={(e) => setReason(e.target.value)}
          />
          <Button
            variant="destructive"
            disabled={!reason || isPending}
            onClick={() =>
              startTransition(async () => {
                await rejectCourse(courseId, reason);
                toast.success("Đã từ chối khóa học");
                setOpen(false);
              })
            }
          >
            Xác nhận từ chối
          </Button>
        </DialogContent>
      </Dialog>
    </div>
  );
}
