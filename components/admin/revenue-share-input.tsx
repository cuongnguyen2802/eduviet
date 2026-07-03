"use client";

import { useState, useTransition } from "react";
import { toast } from "sonner";
import { Input } from "@/components/ui/input";
import { updateRevenueSharePct } from "@/app/actions/admin";

export function RevenueShareInput({ userId, revenueSharePct }: { userId: string; revenueSharePct: number }) {
  const [value, setValue] = useState(revenueSharePct);
  const [isPending, startTransition] = useTransition();

  return (
    <div className="flex items-center gap-1">
      <Input
        type="number"
        min={0}
        max={100}
        value={value}
        onChange={(e) => setValue(Number(e.target.value))}
        onBlur={() => {
          if (value === revenueSharePct) return;
          startTransition(async () => {
            const result = await updateRevenueSharePct(userId, value);
            if (result?.error) {
              toast.error(result.error);
              setValue(revenueSharePct);
            } else {
              toast.success("Đã cập nhật % chia sẻ doanh thu");
            }
          });
        }}
        disabled={isPending}
        className="w-16 h-8 text-sm"
      />
      <span className="text-sm text-muted-foreground">%</span>
    </div>
  );
}
