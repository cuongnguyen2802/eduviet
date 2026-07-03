import { prisma } from "@/lib/prisma";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CouponForm } from "@/components/admin/coupon-form";
import { CouponToggle } from "@/components/admin/coupon-toggle";

export default async function AdminCouponsPage() {
  const coupons = await prisma.coupon.findMany({ orderBy: { code: "asc" } });

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Coupon / Khuyến mãi</h1>
      <CouponForm />

      <div className="space-y-2 mt-6">
        {coupons.map((c) => (
          <Card key={c.id}>
            <CardContent className="p-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <p className="font-mono font-semibold">{c.code}</p>
                <Badge variant="secondary">-{c.discountPct}%</Badge>
                <span className="text-sm text-muted-foreground">
                  {c.usedCount}/{c.maxUses ?? "∞"} lượt dùng
                </span>
                <Badge variant={c.isActive ? "default" : "outline"}>{c.isActive ? "Đang hoạt động" : "Đã tắt"}</Badge>
              </div>
              <CouponToggle couponId={c.id} isActive={c.isActive} />
            </CardContent>
          </Card>
        ))}
        {coupons.length === 0 && <p className="text-muted-foreground text-center py-12">Chưa có coupon nào.</p>}
      </div>
    </div>
  );
}
