"use client";

import { useState, useTransition } from "react";
import { toast } from "sonner";
import { Plus } from "lucide-react";
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
import { createMenuItem } from "@/app/actions/menu";

export function NewMenuItemDialog() {
  const [open, setOpen] = useState(false);
  const [isPending, startTransition] = useTransition();

  function handleSubmit(formData: FormData) {
    startTransition(async () => {
      const result = await createMenuItem(formData);
      if (result?.error) toast.error(result.error);
      else {
        toast.success("Đã thêm mục menu");
        setOpen(false);
      }
    });
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>
          <Plus className="mr-1 h-4 w-4" /> Thêm mục menu
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Thêm mục menu</DialogTitle>
        </DialogHeader>
        <form action={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="label">Tên hiển thị</Label>
            <Input id="label" name="label" placeholder="VD: Khuyến mãi" required />
          </div>
          <div className="space-y-2">
            <Label htmlFor="url">Link</Label>
            <Input id="url" name="url" placeholder="/courses?tag=khuyen-mai" required />
          </div>
          <Button type="submit" disabled={isPending} className="w-full">
            {isPending ? "Đang thêm..." : "Thêm"}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
