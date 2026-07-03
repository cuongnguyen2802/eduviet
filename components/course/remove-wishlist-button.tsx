"use client";

import { useTransition } from "react";
import { X } from "lucide-react";
import { toast } from "sonner";
import { toggleWishlist } from "@/app/actions/wishlist";

export function RemoveWishlistButton({ courseId }: { courseId: string }) {
  const [isPending, startTransition] = useTransition();

  return (
    <button
      type="button"
      disabled={isPending}
      onClick={(e) => {
        e.preventDefault();
        e.stopPropagation();
        startTransition(async () => {
          await toggleWishlist(courseId);
          toast.success("Đã bỏ khỏi yêu thích");
        });
      }}
      className="absolute right-2 top-2 z-10 flex h-7 w-7 items-center justify-center rounded-full bg-background/90 text-muted-foreground shadow hover:bg-destructive hover:text-destructive-foreground disabled:opacity-50"
      aria-label="Bỏ khỏi yêu thích"
    >
      <X className="h-4 w-4" />
    </button>
  );
}
