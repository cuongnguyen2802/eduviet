"use client";

import { useCallback, useRef, useState } from "react";
import { toast } from "sonner";
import { UploadCloud, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

export type UploadedAsset = { id: string; url: string; filename: string };

async function uploadFile(file: File): Promise<UploadedAsset | null> {
  const formData = new FormData();
  formData.set("file", file);
  formData.set("bucket", "media-library");

  const res = await fetch("/api/upload", { method: "POST", body: formData });
  const data = await res.json();

  if (!res.ok) {
    toast.error(`${file.name}: ${data.error ?? "Tải lên thất bại"}`);
    return null;
  }
  return { id: data.id, url: data.url, filename: file.name };
}

export function MediaDropzone({ onUploaded }: { onUploaded: (assets: UploadedAsset[]) => void }) {
  const [isDragging, setIsDragging] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFiles = useCallback(
    async (fileList: FileList) => {
      const files = Array.from(fileList).filter((f) => f.type.startsWith("image/"));
      if (files.length === 0) {
        toast.error("Chỉ hỗ trợ tải lên file ảnh");
        return;
      }

      setIsUploading(true);
      try {
        const results = await Promise.all(files.map(uploadFile));
        const uploaded = results.filter((r): r is UploadedAsset => r !== null);
        if (uploaded.length > 0) {
          toast.success(`Đã tải lên ${uploaded.length} ảnh`);
          onUploaded(uploaded);
        }
      } finally {
        setIsUploading(false);
      }
    },
    [onUploaded]
  );

  return (
    <div
      onDragOver={(e) => {
        e.preventDefault();
        setIsDragging(true);
      }}
      onDragLeave={() => setIsDragging(false)}
      onDrop={(e) => {
        e.preventDefault();
        setIsDragging(false);
        if (e.dataTransfer.files.length > 0) handleFiles(e.dataTransfer.files);
      }}
      onClick={() => inputRef.current?.click()}
      className={cn(
        "flex flex-col items-center justify-center gap-2 rounded-lg border-2 border-dashed p-10 text-center text-sm text-muted-foreground cursor-pointer transition-colors",
        isDragging ? "border-primary bg-primary/5 text-primary" : "hover:border-primary hover:text-primary"
      )}
    >
      {isUploading ? <Loader2 className="h-6 w-6 animate-spin" /> : <UploadCloud className="h-6 w-6" />}
      <p>{isUploading ? "Đang tải lên..." : "Kéo thả ảnh vào đây, hoặc bấm để chọn file"}</p>
      <p className="text-xs">PNG, JPEG, WEBP, GIF — tối đa 5MB mỗi ảnh</p>
      <input
        ref={inputRef}
        type="file"
        accept="image/png,image/jpeg,image/webp,image/gif"
        multiple
        className="hidden"
        disabled={isUploading}
        onChange={(e) => {
          if (e.target.files && e.target.files.length > 0) handleFiles(e.target.files);
          e.target.value = "";
        }}
      />
    </div>
  );
}
