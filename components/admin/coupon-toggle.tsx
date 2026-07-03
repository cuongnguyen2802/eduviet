"use client";

import { useTransition } from "react";
import { Button } from "@/components/ui/button";
import { toggleCouponActive } from "@/app/actions/admin";

export function CouponToggle({ couponId, isActive }: { couponId: string; isActive: boolean }) {
  const [isPending, startTransition] = useTransition();

  return (
    <Button
      size="sm"
      variant={isActive ? "outline" : "secondary"}
      disabled={isPending}
      onClick={() => startTransition(() => toggleCouponActive(couponId, !isActive))}
    >
      {isActive ? "Tắt" : "Bật"}
    </Button>
  );
}
