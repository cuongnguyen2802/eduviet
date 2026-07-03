"use client";

import { useState, useTransition } from "react";
import { Star } from "lucide-react";
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
import { submitReview } from "@/app/actions/review";
import { cn } from "@/lib/utils";

export function ReviewDialog({ courseId, courseTitle }: { courseId: string; courseTitle: string }) {
  const [open, setOpen] = useState(false);
  const [rating, setRating] = useState(5);
  const [isPending, startTransition] = useTransition();

  function handleSubmit(formData: FormData) {
    formData.set("rating", String(rating));
    startTransition(async () => {
      const result = await submitReview(formData);
      if (result?.error) toast.error(result.error);
      else {
        toast.success("Cảm ơn bạn đã đánh giá khóa học!");
        setOpen(false);
      }
    });
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" className="w-full">
          Viết đánh giá
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Đánh giá: {courseTitle}</DialogTitle>
        </DialogHeader>
        <form action={handleSubmit} className="space-y-4">
          <input type="hidden" name="courseId" value={courseId} />
          <div className="flex gap-1">
            {[1, 2, 3, 4, 5].map((star) => (
              <button type="button" key={star} onClick={() => setRating(star)}>
                <Star
                  className={cn(
                    "h-7 w-7",
                    star <= rating ? "fill-yellow-400 text-yellow-400" : "text-muted-foreground"
                  )}
                />
              </button>
            ))}
          </div>
          <Textarea name="comment" placeholder="Chia sẻ cảm nhận của bạn về khóa học..." />
          <Button type="submit" disabled={isPending} className="w-full">
            {isPending ? "Đang gửi..." : "Gửi đánh giá"}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
