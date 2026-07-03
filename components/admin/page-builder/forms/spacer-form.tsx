"use client";

import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import type { SpacerBlockProps } from "@/lib/blocks";

export function SpacerForm({
  props,
  onChange,
}: {
  props: SpacerBlockProps;
  onChange: (props: SpacerBlockProps) => void;
}) {
  return (
    <div className="space-y-2">
      <Label>Chiều cao</Label>
      <Select value={props.height} onValueChange={(v) => onChange({ ...props, height: v as SpacerBlockProps["height"] })}>
        <SelectTrigger className="max-w-[200px]">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="sm">Nhỏ</SelectItem>
          <SelectItem value="md">Vừa</SelectItem>
          <SelectItem value="lg">Lớn</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
}
