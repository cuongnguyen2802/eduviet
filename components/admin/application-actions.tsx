"use client";

import { useTransition } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { reviewInstructorApplication } from "@/app/actions/admin";

export function ApplicationActions({ applicationId }: { applicationId: string }) {
  const [isPending, startTransition] = useTransition();

  return (
    <div className="flex gap-2">
      <Button
        size="sm"
        disabled={isPending}
        onClick={() =>
          startTransition(async () => {
            await reviewInstructorApplication(applicationId, true);
            toast.success("Đã duyệt đăng ký giảng viên");
          })
        }
      >
        Duyệt
      </Button>
      <Button
        size="sm"
        variant="destructive"
        disabled={isPending}
        onClick={() =>
          startTransition(async () => {
            await reviewInstructorApplication(applicationId, false);
            toast.success("Đã từ chối đăng ký");
          })
        }
      >
        Từ chối
      </Button>
    </div>
  );
}
