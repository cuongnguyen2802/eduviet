"use client";

import { useState, useTransition } from "react";
import { Heart } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { toggleWishlist } from "@/app/actions/wishlist";

export function WishlistButton({ courseId, initialWishlisted }: { courseId: string; initialWishlisted: boolean }) {
  const [wishlisted, setWishlisted] = useState(initialWishlisted);
  const [isPending, startTransition] = useTransition();

  return (
    <Button
      variant="outline"
      size="lg"
      className="w-full"
      disabled={isPending}
      onClick={() => {
        startTransition(async () => {
          const result = await toggleWishlist(courseId);
          setWishlisted(result.wishlisted);
          toast.success(result.wishlisted ? "Đã thêm vào yêu thích" : "Đã bỏ khỏi yêu thích");
        });
      }}
    >
      <Heart className={wishlisted ? "mr-2 h-4 w-4 fill-destructive text-destructive" : "mr-2 h-4 w-4"} />
      {wishlisted ? "Đã yêu thích" : "Thêm vào yêu thích"}
    </Button>
  );
}
