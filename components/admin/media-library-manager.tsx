"use client";

import { useEffect, useState, useTransition } from "react";
import Image from "next/image";
import { toast } from "sonner";
import { Trash2, Copy, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { MediaDropzone, type UploadedAsset } from "@/components/admin/media-dropzone";
import { deleteMediaAsset } from "@/app/actions/media";

type Asset = { id: string; url: string; filename: string; createdAt: string };

export function MediaLibraryManager() {
  const [assets, setAssets] = useState<Asset[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isPending, startTransition] = useTransition();

  useEffect(() => {
    fetch("/api/media")
      .then((res) => res.json())
      .then((data) => setAssets(data.assets ?? []))
      .finally(() => setIsLoading(false));
  }, []);

  function handleUploaded(uploaded: UploadedAsset[]) {
    setAssets((prev) => [
      ...uploaded.map((u) => ({ ...u, createdAt: new Date().toISOString() })),
      ...prev,
    ]);
  }

  function handleDelete(id: string) {
    startTransition(async () => {
      await deleteMediaAsset(id);
      setAssets((prev) => prev.filter((a) => a.id !== id));
      toast.success("Đã xóa ảnh");
    });
  }

  function handleCopy(url: string) {
    navigator.clipboard.writeText(url);
    toast.success("Đã sao chép link ảnh");
  }

  return (
    <div className="space-y-6">
      <MediaDropzone onUploaded={handleUploaded} />

      {isLoading ? (
        <div className="flex justify-center py-12">
          <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-6 gap-4">
          {assets.map((asset) => (
            <div key={asset.id} className="group relative aspect-square overflow-hidden rounded-lg border bg-muted">
              <Image src={asset.url} alt={asset.filename} fill className="object-cover" />
              <div className="absolute inset-0 flex items-center justify-center gap-1 bg-black/60 opacity-0 transition-opacity group-hover:opacity-100">
                <Button
                  type="button"
                  variant="secondary"
                  size="icon"
                  className="h-8 w-8"
                  onClick={() => handleCopy(asset.url)}
                >
                  <Copy className="h-4 w-4" />
                </Button>
                <Button
                  type="button"
                  variant="destructive"
                  size="icon"
                  className="h-8 w-8"
                  disabled={isPending}
                  onClick={() => handleDelete(asset.id)}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </div>
          ))}
          {assets.length === 0 && (
            <p className="col-span-full text-center text-sm text-muted-foreground py-12">
              Chưa có ảnh nào trong thư viện.
            </p>
          )}
        </div>
      )}
    </div>
  );
}
