"use client";

import { useState, useTransition } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { formatVND } from "@/lib/format";
import { requestWithdrawal } from "@/app/actions/withdrawal";

export function WithdrawalRequestDialog({ availableBalance }: { availableBalance: number }) {
  const [open, setOpen] = useState(false);
  const [isPending, startTransition] = useTransition();

  function handleSubmit(formData: FormData) {
    startTransition(async () => {
      const result = await requestWithdrawal(formData);
      if (result?.error) toast.error(result.error);
      else {
        toast.success("Đã gửi yêu cầu rút tiền, chờ admin duyệt");
        setOpen(false);
      }
    });
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button disabled={availableBalance <= 0}>Yêu cầu rút tiền</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Yêu cầu rút tiền</DialogTitle>
        </DialogHeader>
        <p className="text-sm text-muted-foreground">
          Số dư khả dụng: <span className="font-semibold text-primary">{formatVND(availableBalance)}</span>
        </p>
        <form action={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="amount">Số tiền muốn rút (VNĐ)</Label>
            <Input id="amount" name="amount" type="number" min={50000} max={availableBalance} required />
          </div>
          <Button type="submit" disabled={isPending} className="w-full">
            {isPending ? "Đang gửi..." : "Gửi yêu cầu"}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
