"use client";

import { useState, useTransition } from "react";
import { toast } from "sonner";
import { Pencil } from "lucide-react";
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
import { updateMenuItem } from "@/app/actions/menu";

export function EditMenuItemDialog({ id, label, url }: { id: string; label: string; url: string }) {
  const [open, setOpen] = useState(false);
  const [isPending, startTransition] = useTransition();

  function handleSubmit(formData: FormData) {
    startTransition(async () => {
      const result = await updateMenuItem(id, formData);
      if (result?.error) toast.error(result.error);
      else {
        toast.success("Đã cập nhật mục menu");
        setOpen(false);
      }
    });
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="ghost" size="icon">
          <Pencil className="h-4 w-4" />
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Sửa mục menu</DialogTitle>
        </DialogHeader>
        <form action={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="label">Tên hiển thị</Label>
            <Input id="label" name="label" defaultValue={label} required />
          </div>
          <div className="space-y-2">
            <Label htmlFor="url">Link</Label>
            <Input id="url" name="url" defaultValue={url} required />
          </div>
          <Button type="submit" disabled={isPending} className="w-full">
            {isPending ? "Đang lưu..." : "Lưu thay đổi"}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
