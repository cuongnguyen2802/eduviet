"use client";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import type { CtaBlockProps } from "@/lib/blocks";

export function CtaForm({ props, onChange }: { props: CtaBlockProps; onChange: (props: CtaBlockProps) => void }) {
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
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label>Nhãn nút bấm</Label>
          <Input value={props.buttonLabel ?? ""} onChange={(e) => onChange({ ...props, buttonLabel: e.target.value })} />
        </div>
        <div className="space-y-2">
          <Label>Link nút bấm</Label>
          <Input value={props.buttonHref ?? ""} onChange={(e) => onChange({ ...props, buttonHref: e.target.value })} placeholder="/courses" />
        </div>
      </div>
      <div className="space-y-2">
        <Label>Kiểu nền</Label>
        <Select value={props.style} onValueChange={(v) => onChange({ ...props, style: v as CtaBlockProps["style"] })}>
          <SelectTrigger className="max-w-[200px]">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="primary">Nổi bật (nhạt)</SelectItem>
            <SelectItem value="dark">Tối</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  );
}
