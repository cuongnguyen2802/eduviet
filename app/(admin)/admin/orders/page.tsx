import { prisma } from "@/lib/prisma";
import { formatVND } from "@/lib/format";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { RefundButton } from "@/components/admin/refund-button";

const statusLabel: Record<string, { label: string; variant: "default" | "secondary" | "destructive" | "outline" }> = {
  PENDING: { label: "Đang chờ thanh toán", variant: "secondary" },
  PAID: { label: "Đã thanh toán", variant: "default" },
  FAILED: { label: "Thất bại", variant: "destructive" },
  REFUNDED: { label: "Đã hoàn tiền", variant: "outline" },
};

export default async function AdminOrdersPage() {
  const orders = await prisma.order.findMany({
    include: { items: { include: { course: true } }, user: true },
    orderBy: { createdAt: "desc" },
    take: 200,
  });

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Đơn hàng</h1>
      <div className="space-y-3">
        {orders.map((order) => (
          <Card key={order.id}>
            <CardContent className="p-4">
              <div className="flex items-center justify-between mb-2">
                <div>
                  <p className="font-medium">
                    #{order.id.slice(-8).toUpperCase()} • {order.user.name}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {order.createdAt.toLocaleDateString("vi-VN")} • {order.paymentMethod} •{" "}
                    {order.items.map((i) => i.course.title).join(", ")}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant={statusLabel[order.status].variant}>{statusLabel[order.status].label}</Badge>
                  <span className="font-semibold text-primary">{formatVND(Number(order.totalAmount))}</span>
                </div>
              </div>
              {order.status === "PAID" && (
                <div className="flex justify-end">
                  <RefundButton orderId={order.id} />
                </div>
              )}
            </CardContent>
          </Card>
        ))}
        {orders.length === 0 && <p className="text-muted-foreground text-center py-12">Chưa có đơn hàng nào.</p>}
      </div>
    </div>
  );
}
