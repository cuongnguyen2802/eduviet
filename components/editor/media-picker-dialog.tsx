"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { ImagePlus, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { MediaDropzone } from "@/components/admin/media-dropzone";

type Asset = { id: string; url: string; filename: string };

export function MediaPickerDialog({
  open,
  onOpenChange,
  onSelect,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSelect: (url: string) => void;
}) {
  const [assets, setAssets] = useState<Asset[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!open) return;
    setIsLoading(true);
    fetch("/api/media")
      .then((res) => res.json())
      .then((data) => setAssets(data.assets ?? []))
      .finally(() => setIsLoading(false));
  }, [open]);

  function handlePick(url: string) {
    onSelect(url);
    onOpenChange(false);
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <ImagePlus className="h-5 w-5" /> Chèn ảnh
          </DialogTitle>
        </DialogHeader>
        <Tabs defaultValue="library">
          <TabsList>
            <TabsTrigger value="library">Thư viện</TabsTrigger>
            <TabsTrigger value="upload">Tải ảnh mới</TabsTrigger>
          </TabsList>

          <TabsContent value="library" className="max-h-96 overflow-y-auto">
            {isLoading ? (
              <div className="flex justify-center py-12">
                <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
              </div>
            ) : (
              <div className="grid grid-cols-3 sm:grid-cols-4 gap-3 pt-2">
                {assets.map((asset) => (
                  <button
                    key={asset.id}
                    type="button"
                    onClick={() => handlePick(asset.url)}
                    className="relative aspect-square overflow-hidden rounded-lg border bg-muted hover:ring-2 hover:ring-primary"
                  >
                    <Image src={asset.url} alt={asset.filename} fill className="object-cover" />
                  </button>
                ))}
                {assets.length === 0 && (
                  <p className="col-span-full text-center text-sm text-muted-foreground py-12">
                    Thư viện chưa có ảnh nào.
                  </p>
                )}
              </div>
            )}
          </TabsContent>

          <TabsContent value="upload" className="pt-2">
            <MediaDropzone onUploaded={(uploaded) => uploaded[0] && handlePick(uploaded[0].url)} />
          </TabsContent>
        </Tabs>
        <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
          Đóng
        </Button>
      </DialogContent>
    </Dialog>
  );
}
