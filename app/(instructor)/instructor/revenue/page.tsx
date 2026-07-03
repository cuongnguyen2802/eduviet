import { Wallet, DollarSign, Percent } from "lucide-react";
import { requireRole } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { formatVND } from "@/lib/format";
import { getInstructorAvailableBalance } from "@/lib/revenue";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { StatCard } from "@/components/dashboard/stat-card";
import { WithdrawalRequestDialog } from "@/components/instructor/withdrawal-request-dialog";

const withdrawalStatusLabel: Record<string, { label: string; variant: "default" | "secondary" | "destructive" }> = {
  PENDING: { label: "Chờ duyệt", variant: "secondary" },
  PAID: { label: "Đã chi trả", variant: "default" },
  REJECTED: { label: "Bị từ chối", variant: "destructive" },
};

export default async function InstructorRevenuePage() {
  const instructor = await requireRole(["INSTRUCTOR", "ADMIN"]);

  const [orderItems, withdrawals, balance] = await Promise.all([
    prisma.orderItem.findMany({
      where: { course: { instructorId: instructor.id }, order: { status: "PAID" } },
      include: { course: true, order: true },
      orderBy: { order: { createdAt: "desc" } },
      take: 100,
    }),
    prisma.withdrawal.findMany({ where: { instructorId: instructor.id }, orderBy: { requestedAt: "desc" } }),
    getInstructorAvailableBalance(instructor.id),
  ]);

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Doanh thu</h1>
        <WithdrawalRequestDialog availableBalance={balance.availableBalance} />
      </div>

      <div className="grid sm:grid-cols-3 gap-4 mb-10">
        <StatCard label="Doanh thu gộp" value={formatVND(balance.grossRevenue)} icon={DollarSign} />
        <StatCard label="Tỷ lệ chia sẻ" value={`${balance.revenueSharePct}%`} icon={Percent} />
        <StatCard label="Số dư khả dụng" value={formatVND(balance.availableBalance)} icon={Wallet} />
      </div>

      <h2 className="text-lg font-semibold mb-3">Lịch sử rút tiền</h2>
      <div className="space-y-2 mb-10">
        {withdrawals.map((w) => (
          <Card key={w.id}>
            <CardContent className="p-4 flex items-center justify-between text-sm">
              <div>
                <p className="font-medium">{formatVND(Number(w.amount))}</p>
                <p className="text-muted-foreground">Yêu cầu ngày {w.requestedAt.toLocaleDateString("vi-VN")}</p>
              </div>
              <Badge variant={withdrawalStatusLabel[w.status].variant}>{withdrawalStatusLabel[w.status].label}</Badge>
            </CardContent>
          </Card>
        ))}
        {withdrawals.length === 0 && <p className="text-sm text-muted-foreground">Bạn chưa có yêu cầu rút tiền nào.</p>}
      </div>

      <h2 className="text-lg font-semibold mb-3">Giao dịch bán khóa học</h2>
      <div className="space-y-2">
        {orderItems.map((item) => (
          <Card key={item.id}>
            <CardContent className="p-4 flex items-center justify-between text-sm">
              <div>
                <p className="font-medium">{item.course.title}</p>
                <p className="text-muted-foreground">
                  {item.order.createdAt.toLocaleDateString("vi-VN")} • Đơn #{item.order.id.slice(-8)}
                </p>
              </div>
              <p className="font-semibold text-primary">{formatVND(Number(item.price))}</p>
            </CardContent>
          </Card>
        ))}
        {orderItems.length === 0 && (
          <p className="text-muted-foreground text-center py-12">Chưa có giao dịch nào.</p>
        )}
      </div>
    </div>
  );
}
