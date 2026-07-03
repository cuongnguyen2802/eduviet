"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { X } from "lucide-react";
import { toast } from "sonner";
import { useCartStore } from "@/lib/cart-store";
import { formatVND } from "@/lib/format";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";

export default function CartPage() {
  const { items, removeItem } = useCartStore();
  const [couponCode, setCouponCode] = useState("");
  const [paymentMethod, setPaymentMethod] = useState<"VNPAY" | "MOMO">("VNPAY");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const subtotal = items.reduce((sum, i) => sum + (i.discountPrice ?? i.price), 0);

  async function handleCheckout() {
    if (items.length === 0) return;
    setIsSubmitting(true);
    try {
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          courseIds: items.map((i) => i.courseId),
          couponCode: couponCode || undefined,
          paymentMethod,
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        toast.error(data.error ?? "Không thể tạo đơn hàng");
        return;
      }
      window.location.href = data.paymentUrl;
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="container py-10 max-w-4xl">
      <h1 className="text-2xl font-bold mb-6">Giỏ hàng của bạn</h1>

      {items.length === 0 ? (
        <div className="text-center py-16">
          <p className="text-muted-foreground mb-4">Giỏ hàng của bạn đang trống.</p>
          <Button asChild>
            <Link href="/courses">Khám phá khóa học</Link>
          </Button>
        </div>
      ) : (
        <div className="grid md:grid-cols-3 gap-8">
          <div className="md:col-span-2 space-y-4">
            {items.map((item) => (
              <Card key={item.courseId}>
                <CardContent className="p-4 flex items-center gap-4">
                  <div className="relative h-16 w-24 shrink-0 rounded bg-muted overflow-hidden">
                    {item.coverImageUrl && (
                      <Image src={item.coverImageUrl} alt={item.title} fill className="object-cover" />
                    )}
                  </div>
                  <div className="flex-1">
                    <p className="font-medium line-clamp-1">{item.title}</p>
                    <p className="text-primary font-semibold text-sm">
                      {formatVND(item.discountPrice ?? item.price)}
                    </p>
                  </div>
                  <Button variant="ghost" size="icon" onClick={() => removeItem(item.courseId)}>
                    <X className="h-4 w-4" />
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>

          <Card className="h-fit">
            <CardContent className="p-6 space-y-4">
              <div className="flex justify-between font-semibold text-lg">
                <span>Tổng cộng</span>
                <span className="text-primary">{formatVND(subtotal)}</span>
              </div>

              <Input
                placeholder="Mã giảm giá"
                value={couponCode}
                onChange={(e) => setCouponCode(e.target.value)}
              />

              <div className="space-y-2">
                <p className="text-sm font-medium">Phương thức thanh toán</p>
                <div className="flex gap-2">
                  <Button
                    type="button"
                    variant={paymentMethod === "VNPAY" ? "default" : "outline"}
                    className="flex-1"
                    onClick={() => setPaymentMethod("VNPAY")}
                  >
                    VNPay
                  </Button>
                  <Button
                    type="button"
                    variant={paymentMethod === "MOMO" ? "default" : "outline"}
                    className="flex-1"
                    onClick={() => setPaymentMethod("MOMO")}
                  >
                    MoMo
                  </Button>
                </div>
              </div>

              <Button className="w-full" size="lg" disabled={isSubmitting} onClick={handleCheckout}>
                {isSubmitting ? "Đang xử lý..." : "Thanh toán"}
              </Button>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}
