"use client";

import { useState, useTransition } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { updateCourse } from "@/app/actions/course";
import { ImageUpload } from "@/components/forms/image-upload";
import { RichTextEditor } from "@/components/editor/rich-text-editor";
import type { Course } from "@prisma/client";

type LeafCategory = { id: string; name: string; parent: { name: string } | null };

function groupByParent(categories: LeafCategory[]) {
  const groups = new Map<string, LeafCategory[]>();
  for (const cat of categories) {
    const key = cat.parent?.name ?? "Khác";
    groups.set(key, [...(groups.get(key) ?? []), cat]);
  }
  return [...groups.entries()];
}

export function CourseInfoForm({
  course,
  categories,
  tags,
  selectedTagIds,
}: {
  course: Course;
  categories: LeafCategory[];
  tags: { id: string; name: string }[];
  selectedTagIds: string[];
}) {
  const [level, setLevel] = useState(course.level);
  const [categoryId, setCategoryId] = useState(course.categoryId);
  const [isPending, startTransition] = useTransition();

  function handleSubmit(formData: FormData) {
    startTransition(async () => {
      const result = await updateCourse(course.id, formData);
      if (result?.error) toast.error(result.error);
      else toast.success("Đã lưu thông tin khóa học");
    });
  }

  return (
    <form action={handleSubmit} className="space-y-4 max-w-2xl">
      <div className="space-y-2">
        <Label htmlFor="title">Tiêu đề</Label>
        <Input id="title" name="title" defaultValue={course.title} required />
      </div>
      <div className="space-y-2">
        <Label>Mô tả</Label>
        <RichTextEditor name="description" defaultValue={course.description} placeholder="Mô tả khóa học..." />
      </div>
      <div className="space-y-2">
        <Label>Ảnh cover</Label>
        <ImageUpload bucket="course-covers" name="coverImageUrl" defaultValue={course.coverImageUrl} />
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="price">Giá gốc (VNĐ)</Label>
          <Input id="price" name="price" type="number" min={0} defaultValue={Number(course.price)} required />
        </div>
        <div className="space-y-2">
          <Label htmlFor="discountPrice">Giá khuyến mãi (VNĐ)</Label>
          <Input
            id="discountPrice"
            name="discountPrice"
            type="number"
            min={0}
            defaultValue={course.discountPrice ? Number(course.discountPrice) : ""}
          />
        </div>
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="level">Cấp độ</Label>
          <input type="hidden" name="level" value={level} />
          <Select value={level} onValueChange={(v) => setLevel(v as typeof level)}>
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
        <div className="space-y-2">
          <Label htmlFor="categoryId">Danh mục</Label>
          <input type="hidden" name="categoryId" value={categoryId} />
          <Select value={categoryId} onValueChange={setCategoryId}>
            <SelectTrigger id="categoryId">
              <SelectValue />
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
      </div>
      <div className="space-y-2">
        <Label>Tag</Label>
        <div className="flex flex-wrap gap-3">
          {tags.map((tag) => (
            <label key={tag.id} className="flex items-center gap-1.5 text-sm">
              <input
                type="checkbox"
                name="tagIds"
                value={tag.id}
                defaultChecked={selectedTagIds.includes(tag.id)}
                className="h-4 w-4"
              />
              {tag.name}
            </label>
          ))}
          {tags.length === 0 && <p className="text-sm text-muted-foreground">Chưa có tag nào — tạo tag ở trang Admin.</p>}
        </div>
      </div>
      <Button type="submit" disabled={isPending}>
        {isPending ? "Đang lưu..." : "Lưu thay đổi"}
      </Button>
    </form>
  );
}
