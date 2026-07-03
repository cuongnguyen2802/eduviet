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
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ImageUpload } from "@/components/forms/image-upload";
import { RichTextEditor } from "@/components/editor/rich-text-editor";
import { createBlogPost, updateBlogPost } from "@/app/actions/blog";

type BlogPostRow = {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  coverImageUrl: string | null;
  status: "DRAFT" | "PUBLISHED";
  metaTitle: string | null;
  metaDescription: string | null;
};

export function BlogPostForm({ post }: { post?: BlogPostRow }) {
  const [status, setStatus] = useState(post?.status ?? "DRAFT");
  const [isPending, startTransition] = useTransition();

  function handleSubmit(formData: FormData) {
    startTransition(async () => {
      const result = post ? await updateBlogPost(post.id, formData) : await createBlogPost(formData);
      if (result?.error) toast.error(result.error);
      else if (post) toast.success("Đã lưu bài viết");
    });
  }

  return (
    <form action={handleSubmit} className="space-y-4 max-w-2xl">
      <div className="space-y-2">
        <Label htmlFor="title">Tiêu đề</Label>
        <Input id="title" name="title" defaultValue={post?.title} required />
      </div>

      <div className="space-y-2">
        <Label htmlFor="slug">Slug (để trống sẽ tự tạo từ tiêu đề)</Label>
        <Input id="slug" name="slug" defaultValue={post?.slug} placeholder="vd: 5-meo-hoc-online-hieu-qua" />
      </div>

      <div className="space-y-2">
        <Label>Ảnh cover</Label>
        <ImageUpload bucket="blog-covers" name="coverImageUrl" defaultValue={post?.coverImageUrl} />
      </div>

      <div className="space-y-2">
        <Label htmlFor="excerpt">Mô tả ngắn</Label>
        <Textarea id="excerpt" name="excerpt" defaultValue={post?.excerpt} rows={2} required />
      </div>

      <div className="space-y-2">
        <Label>Nội dung</Label>
        <RichTextEditor name="content" defaultValue={post?.content} placeholder="Viết nội dung bài viết..." />
      </div>

      <div className="space-y-2">
        <Label htmlFor="status">Trạng thái</Label>
        <input type="hidden" name="status" value={status} />
        <Select value={status} onValueChange={(v) => setStatus(v as typeof status)}>
          <SelectTrigger id="status">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="DRAFT">Bản nháp</SelectItem>
            <SelectItem value="PUBLISHED">Xuất bản</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label htmlFor="metaTitle">SEO title (để trống sẽ dùng tiêu đề bài viết)</Label>
        <Input id="metaTitle" name="metaTitle" defaultValue={post?.metaTitle ?? ""} maxLength={70} />
      </div>

      <div className="space-y-2">
        <Label htmlFor="metaDescription">SEO description (để trống sẽ dùng mô tả ngắn)</Label>
        <Textarea id="metaDescription" name="metaDescription" defaultValue={post?.metaDescription ?? ""} maxLength={160} rows={2} />
      </div>

      <Button type="submit" disabled={isPending}>
        {isPending ? "Đang lưu..." : post ? "Lưu thay đổi" : "Tạo bài viết"}
      </Button>
    </form>
  );
}
