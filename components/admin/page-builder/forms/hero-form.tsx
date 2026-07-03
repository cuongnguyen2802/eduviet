"use client";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ImagePickerField } from "@/components/admin/page-builder/image-picker-field";
import type { HeroBlockProps } from "@/lib/blocks";

export function HeroForm({ props, onChange }: { props: HeroBlockProps; onChange: (props: HeroBlockProps) => void }) {
  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label>Tiêu đề</Label>
        <Input value={props.title} onChange={(e) => onChange({ ...props, title: e.target.value })} />
      </div>
      <div className="space-y-2">
        <Label>Mô tả phụ</Label>
        <Input value={props.subtitle ?? ""} onChange={(e) => onChange({ ...props, subtitle: e.target.value })} />
      </div>
      <ImagePickerField
        label="Ảnh nền (tùy chọn)"
        value={props.imageUrl}
        onChange={(url) => onChange({ ...props, imageUrl: url })}
      />
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label>Nhãn nút bấm (tùy chọn)</Label>
          <Input value={props.ctaLabel ?? ""} onChange={(e) => onChange({ ...props, ctaLabel: e.target.value })} />
        </div>
        <div className="space-y-2">
          <Label>Link nút bấm</Label>
          <Input value={props.ctaHref ?? ""} onChange={(e) => onChange({ ...props, ctaHref: e.target.value })} placeholder="/courses" />
        </div>
      </div>
      <div className="space-y-2">
        <Label>Màu nền</Label>
        <Select value={props.variant} onValueChange={(v) => onChange({ ...props, variant: v as HeroBlockProps["variant"] })}>
          <SelectTrigger className="max-w-[200px]">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="dark">Tối</SelectItem>
            <SelectItem value="light">Sáng</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  );
}
