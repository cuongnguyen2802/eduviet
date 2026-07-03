"use client";

import { useState, useTransition } from "react";
import { toast } from "sonner";
import { Pencil } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
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
import { updateCategory } from "@/app/actions/admin";

const ICON_OPTIONS = [
  { value: "Briefcase", label: "Briefcase (Kinh doanh)" },
  { value: "TrendingUp", label: "TrendingUp (Marketing)" },
  { value: "Palette", label: "Palette (Thiết kế)" },
  { value: "Monitor", label: "Monitor (CNTT)" },
  { value: "Languages", label: "Languages (Ngoại ngữ)" },
];

type CategoryRow = {
  id: string;
  name: string;
  slug: string;
  icon: string | null;
  description: string | null;
  metaTitle: string | null;
  parentId: string | null;
};

export function EditCategoryDialog({
  category,
  parents,
}: {
  category: CategoryRow;
  parents: { id: string; name: string }[];
}) {
  const [open, setOpen] = useState(false);
  const [icon, setIcon] = useState(category.icon ?? "none");
  const [parentId, setParentId] = useState(category.parentId ?? "none");
  const [isPending, startTransition] = useTransition();

  function handleSubmit(formData: FormData) {
    startTransition(async () => {
      const result = await updateCategory(category.id, formData);
      if (result?.error) toast.error(result.error);
      else {
        toast.success("Đã cập nhật danh mục");
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
          <DialogTitle>Sửa danh mục</DialogTitle>
        </DialogHeader>
        <form action={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Tên danh mục</Label>
            <Input id="name" name="name" defaultValue={category.name} required />
          </div>

          <div className="space-y-2">
            <Label htmlFor="slug">Slug (dùng trong link /courses?category=...)</Label>
            <Input id="slug" name="slug" defaultValue={category.slug} placeholder="vd: marketing-so" />
            <p className="text-xs text-muted-foreground">
              Đổi slug sẽ làm hỏng các link cũ đang trỏ tới danh mục này — chỉ nên đổi khi cần thiết.
            </p>
          </div>

          <div className="space-y-2">
            <Label>Danh mục cha</Label>
            <input type="hidden" name="parentId" value={parentId === "none" ? "" : parentId} />
            <Select value={parentId} onValueChange={setParentId}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="none">— Là danh mục cha (gốc) —</SelectItem>
                {parents
                  .filter((p) => p.id !== category.id)
                  .map((p) => (
                    <SelectItem key={p.id} value={p.id}>
                      Con của: {p.name}
                    </SelectItem>
                  ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label>Icon (hiển thị ở mega menu / trang chủ)</Label>
            <input type="hidden" name="icon" value={icon === "none" ? "" : icon} />
            <Select value={icon} onValueChange={setIcon}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="none">Không có icon</SelectItem>
                {ICON_OPTIONS.map((opt) => (
                  <SelectItem key={opt.value} value={opt.value}>
                    {opt.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Mô tả danh mục (hiển thị ở trang danh sách khóa học + SEO)</Label>
            <Textarea
              id="description"
              name="description"
              defaultValue={category.description ?? ""}
              maxLength={500}
              placeholder="VD: Khám phá các khóa học Marketing số từ cơ bản đến nâng cao..."
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="metaTitle">SEO title (để trống sẽ dùng mặc định)</Label>
            <Input
              id="metaTitle"
              name="metaTitle"
              defaultValue={category.metaTitle ?? ""}
              maxLength={70}
              placeholder="VD: Khóa học Marketing số chất lượng cao — EduViet"
            />
          </div>

          <Button type="submit" disabled={isPending} className="w-full">
            {isPending ? "Đang lưu..." : "Lưu thay đổi"}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
