"use client";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ImagePickerField } from "@/components/admin/page-builder/image-picker-field";
import { RichTextEditor } from "@/components/editor/rich-text-editor";
import type { ImageTextBlockProps } from "@/lib/blocks";

export function ImageTextForm({
  props,
  onChange,
}: {
  props: ImageTextBlockProps;
  onChange: (props: ImageTextBlockProps) => void;
}) {
  return (
    <div className="space-y-4">
      <ImagePickerField label="Ảnh" value={props.imageUrl} onChange={(url) => onChange({ ...props, imageUrl: url })} />
      <div className="space-y-2">
        <Label>Vị trí ảnh</Label>
        <Select
          value={props.imagePosition}
          onValueChange={(v) => onChange({ ...props, imagePosition: v as ImageTextBlockProps["imagePosition"] })}
        >
          <SelectTrigger className="max-w-[200px]">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="left">Bên trái</SelectItem>
            <SelectItem value="right">Bên phải</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <div className="space-y-2">
        <Label>Tiêu đề (tùy chọn)</Label>
        <Input value={props.title ?? ""} onChange={(e) => onChange({ ...props, title: e.target.value })} />
      </div>
      <div className="space-y-2">
        <Label>Nội dung</Label>
        <RichTextEditor defaultValue={props.html} onChange={(html) => onChange({ ...props, html })} />
      </div>
    </div>
  );
}
