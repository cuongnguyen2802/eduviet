"use client";

import { useEffect } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { CheckCircle2, XCircle } from "lucide-react";
import { useCartStore } from "@/lib/cart-store";
import { Button } from "@/components/ui/button";

export default function CheckoutResultPage() {
  const searchParams = useSearchParams();
  const status = searchParams.get("status");
  const clear = useCartStore((s) => s.clear);
  const success = status === "success";

  useEffect(() => {
    if (success) clear();
  }, [success, clear]);

  return (
    <div className="container py-20 max-w-md text-center">
      {success ? (
        <>
          <CheckCircle2 className="mx-auto h-16 w-16 text-green-500" />
          <h1 className="text-2xl font-bold mt-4">Thanh toán thành công!</h1>
          <p className="text-muted-foreground mt-2">
            Khóa học đã được thêm vào tài khoản của bạn. Chúc bạn học tốt!
          </p>
          <Button asChild className="mt-6">
            <Link href="/dashboard">Vào học ngay</Link>
          </Button>
        </>
      ) : (
        <>
          <XCircle className="mx-auto h-16 w-16 text-destructive" />
          <h1 className="text-2xl font-bold mt-4">Thanh toán không thành công</h1>
          <p className="text-muted-foreground mt-2">
            Giao dịch của bạn chưa được xử lý thành công. Vui lòng thử lại.
          </p>
          <Button asChild className="mt-6" variant="outline">
            <Link href="/cart">Quay lại giỏ hàng</Link>
          </Button>
        </>
      )}
    </div>
  );
}
