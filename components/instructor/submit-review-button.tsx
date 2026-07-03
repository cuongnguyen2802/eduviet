"use client";

import { useTransition } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { submitCourseForReview } from "@/app/actions/course";

export function SubmitReviewButton({ courseId }: { courseId: string }) {
  const [isPending, startTransition] = useTransition();

  return (
    <Button
      variant="secondary"
      disabled={isPending}
      onClick={() =>
        startTransition(async () => {
          const result = await submitCourseForReview(courseId);
          if (result?.error) toast.error(result.error);
          else toast.success("Đã gửi khóa học để admin xét duyệt");
        })
      }
    >
      {isPending ? "Đang gửi..." : "Gửi duyệt khóa học"}
    </Button>
  );
}
