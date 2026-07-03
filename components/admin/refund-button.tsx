"use client";

import { useState, useTransition } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { refundOrderAction } from "@/app/actions/admin";

export function RefundButton({ orderId }: { orderId: string }) {
  const [open, setOpen] = useState(false);
  const [isPending, startTransition] = useTransition();

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button size="sm" variant="outline">
          Hoàn tiền
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Xác nhận hoàn tiền</DialogTitle>
        </DialogHeader>
        <p className="text-sm text-muted-foreground">
          Hành động này sẽ đánh dấu đơn hàng là đã hoàn tiền và thu hồi quyền truy cập vào các khóa học trong đơn.
          Không thể hoàn tác.
        </p>
        <Button
          variant="destructive"
          disabled={isPending}
          onClick={() =>
            startTransition(async () => {
              const result = await refundOrderAction(orderId);
              if (result?.error) toast.error(result.error);
              else {
                toast.success("Đã hoàn tiền đơn hàng");
                setOpen(false);
              }
            })
          }
        >
          {isPending ? "Đang xử lý..." : "Xác nhận hoàn tiền"}
        </Button>
      </DialogContent>
    </Dialog>
  );
}
