"use client";

import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { useCartStore, type CartItem } from "@/lib/cart-store";

export function AddToCartButton({ course }: { course: CartItem }) {
  const router = useRouter();
  const { items, addItem } = useCartStore();
  const inCart = items.some((i) => i.courseId === course.courseId);

  return (
    <Button
      size="lg"
      variant="outline"
      className="w-full"
      onClick={() => {
        if (inCart) {
          router.push("/cart");
          return;
        }
        addItem(course);
        toast.success("Đã thêm khóa học vào giỏ hàng");
      }}
    >
      {inCart ? "Xem giỏ hàng" : "Thêm vào giỏ hàng"}
    </Button>
  );
}
