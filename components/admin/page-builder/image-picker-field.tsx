"use client";

import { useState } from "react";
import Image from "next/image";
import { ImagePlus, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { MediaPickerDialog } from "@/components/editor/media-picker-dialog";

export function ImagePickerField({
  label,
  value,
  onChange,
}: {
  label: string;
  value?: string;
  onChange: (url: string) => void;
}) {
  const [open, setOpen] = useState(false);

  return (
    <div className="space-y-2">
      <Label>{label}</Label>
      {value ? (
        <div className="relative aspect-video w-full max-w-xs overflow-hidden rounded-lg border bg-muted">
          <Image src={value} alt="" fill className="object-cover" />
          <Button
            type="button"
            variant="destructive"
            size="icon"
            className="absolute right-2 top-2 h-7 w-7"
            onClick={() => onChange("")}
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      ) : (
        <button
          type="button"
          onClick={() => setOpen(true)}
          className="flex h-32 w-full max-w-xs flex-col items-center justify-center gap-2 rounded-lg border border-dashed text-sm text-muted-foreground hover:border-primary hover:text-primary"
        >
          <ImagePlus className="h-5 w-5" />
          Chọn ảnh
        </button>
      )}
      {value && (
        <Button type="button" variant="outline" size="sm" onClick={() => setOpen(true)}>
          Đổi ảnh khác
        </Button>
      )}
      <MediaPickerDialog open={open} onOpenChange={setOpen} onSelect={onChange} />
    </div>
  );
}
