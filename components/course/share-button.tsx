"use client";

import { Share2 } from "lucide-react";
import { toast } from "sonner";

export function ShareButton({ title }: { title: string }) {
  async function handleShare() {
    const url = window.location.href;
    if (navigator.share) {
      try {
        await navigator.share({ title, url });
      } catch {
        // Người dùng huỷ share sheet — bỏ qua.
      }
      return;
    }
    await navigator.clipboard.writeText(url);
    toast.success("Đã sao chép link khóa học");
  }

  return (
    <button
      type="button"
      onClick={handleShare}
      className="flex items-center gap-1 text-sm text-muted-foreground hover:text-primary"
    >
      <Share2 className="h-3.5 w-3.5" /> Chia sẻ
    </button>
  );
}
