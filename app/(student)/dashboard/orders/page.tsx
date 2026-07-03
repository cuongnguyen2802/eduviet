import { requireUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { formatVND } from "@/lib/format";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

const statusLabel: Record<string, { label: string; variant: "default" | "secondary" | "destructive" | "outline" }> = {
  PENDING: { label: "Đang chờ thanh toán", variant: "secondary" },
  PAID: { label: "Đã thanh toán", variant: "default" },
  FAILED: { label: "Thất bại", variant: "destructive" },
  REFUNDED: { label: "Đã hoàn tiền", variant: "outline" },
};

export default async function OrdersPage() {
  const user = await requireUser();

  const orders = await prisma.order.findMany({
    where: { userId: user.id },
    include: { items: { include: { course: true } }, coupon: true },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Đơn hàng của tôi</h1>

      <div className="space-y-3">
        {orders.map((order) => (
          <Card key={order.id}>
            <CardContent className="p-4 space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Đơn #{order.id.slice(-8).toUpperCase()}</p>
                  <p className="text-sm text-muted-foreground">
                    {order.createdAt.toLocaleDateString("vi-VN")} • {order.paymentMethod}
                    {order.coupon && ` • Mã: ${order.coupon.code}`}
                  </p>
                </div>
                <Badge variant={statusLabel[order.status].variant}>{statusLabel[order.status].label}</Badge>
              </div>

              <div className="divide-y border-t">
                {order.items.map((item) => (
                  <div key={item.id} className="flex items-center justify-between py-2 text-sm">
                    <span>{item.course.title}</span>
                    <span className="font-medium">{formatVND(Number(item.price))}</span>
                  </div>
                ))}
              </div>

              <div className="flex items-center justify-between border-t pt-2 font-semibold">
                <span>Tổng cộng</span>
                <span className="text-primary">{formatVND(Number(order.totalAmount))}</span>
              </div>
            </CardContent>
          </Card>
        ))}
        {orders.length === 0 && (
          <p className="text-muted-foreground text-center py-12">Bạn chưa có đơn hàng nào.</p>
        )}
      </div>
    </div>
  );
}
