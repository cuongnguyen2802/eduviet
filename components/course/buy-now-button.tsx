"use client";

import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { useCartStore, type CartItem } from "@/lib/cart-store";

export function BuyNowButton({ course }: { course: CartItem }) {
  const router = useRouter();
  const { items, addItem } = useCartStore();

  return (
    <Button
      size="lg"
      className="w-full"
      onClick={() => {
        if (!items.some((i) => i.courseId === course.courseId)) addItem(course);
        router.push("/cart");
      }}
    >
      Mua ngay
    </Button>
  );
}
