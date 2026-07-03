"use client";

import { useState, useTransition } from "react";
import { toast } from "sonner";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { createPage } from "@/app/actions/pages";

export function NewPageDialog() {
  const [open, setOpen] = useState(false);
  const [isPending, startTransition] = useTransition();

  function handleSubmit(formData: FormData) {
    startTransition(async () => {
      const result = await createPage({
        title: String(formData.get("title") ?? ""),
        slug: String(formData.get("slug") ?? ""),
      });
      if (result?.error) toast.error(result.error);
    });
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>
          <Plus className="mr-1 h-4 w-4" /> Tạo trang mới
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Tạo trang mới</DialogTitle>
        </DialogHeader>
        <form action={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="title">Tiêu đề</Label>
            <Input id="title" name="title" placeholder="VD: Chính sách bảo mật" required />
          </div>
          <div className="space-y-2">
            <Label htmlFor="slug">Slug (để trống sẽ tự tạo từ tiêu đề)</Label>
            <Input id="slug" name="slug" placeholder="vd: chinh-sach-bao-mat" />
          </div>
          <Button type="submit" disabled={isPending} className="w-full">
            {isPending ? "Đang tạo..." : "Tạo & mở trình xây dựng"}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
