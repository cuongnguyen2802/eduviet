"use client";

import { useTransition } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { reviewWithdrawal } from "@/app/actions/withdrawal";

export function WithdrawalReviewActions({ withdrawalId }: { withdrawalId: string }) {
  const [isPending, startTransition] = useTransition();

  return (
    <div className="flex gap-2">
      <Button
        size="sm"
        disabled={isPending}
        onClick={() =>
          startTransition(async () => {
            await reviewWithdrawal(withdrawalId, true);
            toast.success("Đã xác nhận chi trả");
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
            await reviewWithdrawal(withdrawalId, false);
            toast.success("Đã từ chối yêu cầu");
          })
        }
      >
        Từ chối
      </Button>
    </div>
  );
}
