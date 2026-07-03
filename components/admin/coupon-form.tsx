"use client";

import { useTransition } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { createCoupon } from "@/app/actions/admin";

export function CouponForm() {
  const [isPending, startTransition] = useTransition();

  function handleSubmit(formData: FormData) {
    startTransition(async () => {
      const result = await createCoupon(formData);
      if (result?.error) toast.error(result.error);
      else toast.success("Đã tạo coupon");
    });
  }

  return (
    <form action={handleSubmit} className="grid sm:grid-cols-4 gap-2 max-w-2xl items-end">
      <div className="space-y-1">
        <Label htmlFor="code">Mã coupon</Label>
        <Input id="code" name="code" placeholder="WELCOME50" required />
      </div>
      <div className="space-y-1">
        <Label htmlFor="discountPct">Giảm giá (%)</Label>
        <Input id="discountPct" name="discountPct" type="number" min={1} max={100} required />
      </div>
      <div className="space-y-1">
        <Label htmlFor="maxUses">Số lượt dùng tối đa</Label>
        <Input id="maxUses" name="maxUses" type="number" min={1} />
      </div>
      <Button type="submit" disabled={isPending}>
        Tạo coupon
      </Button>
    </form>
  );
}
