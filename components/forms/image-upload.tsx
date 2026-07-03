"use client";

import { useRef, useState } from "react";
import Image from "next/image";
import { toast } from "sonner";
import { Loader2, Upload, X } from "lucide-react";
import { Button } from "@/components/ui/button";

export function ImageUpload({
  bucket,
  name,
  defaultValue,
  aspect = "aspect-video",
}: {
  bucket: "course-covers" | "avatars" | "blog-covers";
  name: string;
  defaultValue?: string | null;
  aspect?: string;
}) {
  const [url, setUrl] = useState(defaultValue ?? "");
  const [isUploading, setIsUploading] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  async function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    try {
      const formData = new FormData();
      formData.set("file", file);
      formData.set("bucket", bucket);

      const res = await fetch("/api/upload", { method: "POST", body: formData });
      const data = await res.json();

      if (!res.ok) {
        toast.error(data.error ?? "Tải ảnh lên thất bại");
        return;
      }
      setUrl(data.url);
    } finally {
      setIsUploading(false);
      if (inputRef.current) inputRef.current.value = "";
    }
  }

  return (
    <div className="space-y-2">
      <input type="hidden" name={name} value={url} />
      {url ? (
        <div className={`relative ${aspect} w-full max-w-xs overflow-hidden rounded-lg border bg-muted`}>
          <Image src={url} alt="" fill className="object-cover" />
          <Button
            type="button"
            variant="destructive"
            size="icon"
            className="absolute right-2 top-2 h-7 w-7"
            onClick={() => setUrl("")}
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      ) : (
        <label className="flex h-32 w-full max-w-xs cursor-pointer flex-col items-center justify-center gap-2 rounded-lg border border-dashed text-sm text-muted-foreground hover:border-primary hover:text-primary">
          {isUploading ? <Loader2 className="h-5 w-5 animate-spin" /> : <Upload className="h-5 w-5" />}
          {isUploading ? "Đang tải lên..." : "Chọn ảnh để tải lên"}
          <input
            ref={inputRef}
            type="file"
            accept="image/png,image/jpeg,image/webp,image/gif"
            className="hidden"
            disabled={isUploading}
            onChange={handleFileChange}
          />
        </label>
      )}
    </div>
  );
}
