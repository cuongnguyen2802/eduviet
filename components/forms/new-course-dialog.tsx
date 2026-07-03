"use client";

import { useState, useTransition } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { createCourse } from "@/app/actions/course";

type LeafCategory = { id: string; name: string; parent: { name: string } | null };

function groupByParent(categories: LeafCategory[]) {
  const groups = new Map<string, LeafCategory[]>();
  for (const cat of categories) {
    const key = cat.parent?.name ?? "Khác";
    groups.set(key, [...(groups.get(key) ?? []), cat]);
  }
  return [...groups.entries()];
}

export function NewCourseDialog({ categories }: { categories: LeafCategory[] }) {
  const [open, setOpen] = useState(false);
  const [level, setLevel] = useState("BEGINNER");
  const [categoryId, setCategoryId] = useState(categories[0]?.id ?? "");
  const [isPending, startTransition] = useTransition();

  function handleSubmit(formData: FormData) {
    startTransition(async () => {
      const result = await createCourse(formData);
      if (result?.error) toast.error(result.error);
    });
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>Tạo khóa học mới</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Tạo khóa học mới</DialogTitle>
        </DialogHeader>
        <form action={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="title">Tiêu đề</Label>
            <Input id="title" name="title" required />
          </div>
          <div className="space-y-2">
            <Label htmlFor="description">Mô tả</Label>
            <Textarea id="description" name="description" required />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="price">Giá (VNĐ)</Label>
              <Input id="price" name="price" type="number" min={0} required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="level">Cấp độ</Label>
              <input type="hidden" name="level" value={level} />
              <Select value={level} onValueChange={setLevel}>
                <SelectTrigger id="level">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="BEGINNER">Cơ bản</SelectItem>
                  <SelectItem value="INTERMEDIATE">Trung cấp</SelectItem>
                  <SelectItem value="ADVANCED">Nâng cao</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="categoryId">Danh mục</Label>
            <input type="hidden" name="categoryId" value={categoryId} />
            <Select value={categoryId} onValueChange={setCategoryId}>
              <SelectTrigger id="categoryId">
                <SelectValue placeholder="Chọn danh mục" />
              </SelectTrigger>
              <SelectContent>
                {groupByParent(categories).map(([parentName, items]) => (
                  <SelectGroup key={parentName}>
                    <SelectLabel>{parentName}</SelectLabel>
                    {items.map((c) => (
                      <SelectItem key={c.id} value={c.id}>
                        {c.name}
                      </SelectItem>
                    ))}
                  </SelectGroup>
                ))}
              </SelectContent>
            </Select>
          </div>
          <Button type="submit" disabled={isPending} className="w-full">
            {isPending ? "Đang tạo..." : "Tạo khóa học"}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
