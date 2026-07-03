"use client";

import { useState, useTransition } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { createCategory } from "@/app/actions/admin";

export function CategoryForm({ parents }: { parents: { id: string; name: string }[] }) {
  const [parentId, setParentId] = useState("none");
  const [isPending, startTransition] = useTransition();

  function handleSubmit(formData: FormData) {
    startTransition(async () => {
      const result = await createCategory(formData);
      if (result?.error) toast.error(result.error);
    });
  }

  return (
    <form action={handleSubmit} className="flex flex-wrap gap-2 max-w-xl">
      <Input name="name" placeholder="Tên danh mục mới" required className="flex-1 min-w-[180px]" />
      <Input name="slug" placeholder="Slug (để trống sẽ tự tạo)" className="w-48" />
      <input type="hidden" name="parentId" value={parentId === "none" ? "" : parentId} />
      <Select value={parentId} onValueChange={setParentId}>
        <SelectTrigger className="w-56">
          <SelectValue placeholder="Danh mục cha" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="none">— Tạo danh mục cha mới —</SelectItem>
          {parents.map((p) => (
            <SelectItem key={p.id} value={p.id}>
              Con của: {p.name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      <Button type="submit" disabled={isPending}>
        Thêm
      </Button>
    </form>
  );
}
