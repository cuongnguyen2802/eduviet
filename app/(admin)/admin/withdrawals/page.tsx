import { prisma } from "@/lib/prisma";
import { formatVND } from "@/lib/format";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { WithdrawalReviewActions } from "@/components/admin/withdrawal-review-actions";

const statusLabel: Record<string, { label: string; variant: "default" | "secondary" | "destructive" }> = {
  PENDING: { label: "Chờ duyệt", variant: "secondary" },
  PAID: { label: "Đã chi trả", variant: "default" },
  REJECTED: { label: "Bị từ chối", variant: "destructive" },
};

export default async function AdminWithdrawalsPage() {
  const withdrawals = await prisma.withdrawal.findMany({
    include: { instructor: true },
    orderBy: [{ status: "asc" }, { requestedAt: "desc" }],
  });

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Duyệt rút tiền</h1>
      <div className="space-y-3">
        {withdrawals.map((w) => (
          <Card key={w.id}>
            <CardContent className="p-4 flex items-center justify-between">
              <div>
                <div className="flex items-center gap-2">
                  <p className="font-medium">{w.instructor.name}</p>
                  <Badge variant={statusLabel[w.status].variant}>{statusLabel[w.status].label}</Badge>
                </div>
                <p className="text-sm text-muted-foreground">
                  {formatVND(Number(w.amount))} • Yêu cầu ngày {w.requestedAt.toLocaleDateString("vi-VN")}
                </p>
              </div>
              {w.status === "PENDING" && <WithdrawalReviewActions withdrawalId={w.id} />}
            </CardContent>
          </Card>
        ))}
        {withdrawals.length === 0 && (
          <p className="text-muted-foreground text-center py-12">Chưa có yêu cầu rút tiền nào.</p>
        )}
      </div>
    </div>
  );
}
