import { prisma } from "@/lib/prisma";

/** Tổng doanh thu gộp (trước chia sẻ) từ các đơn hàng đã thanh toán của giảng viên. */
export async function getInstructorGrossRevenue(instructorId: string) {
  const items = await prisma.orderItem.findMany({
    where: { course: { instructorId }, order: { status: "PAID" } },
  });
  return items.reduce((sum, i) => sum + Number(i.price), 0);
}

/** Số dư khả dụng để rút = doanh thu đã chia sẻ cho giảng viên - (đã rút + đang chờ duyệt). */
export async function getInstructorAvailableBalance(instructorId: string) {
  const [instructor, gross, reserved] = await Promise.all([
    prisma.user.findUniqueOrThrow({ where: { id: instructorId } }),
    getInstructorGrossRevenue(instructorId),
    prisma.withdrawal.aggregate({
      where: { instructorId, status: { in: ["PENDING", "PAID"] } },
      _sum: { amount: true },
    }),
  ]);

  const earnedShare = Math.round(gross * (instructor.revenueSharePct / 100));
  const alreadyReserved = Number(reserved._sum.amount ?? 0);

  return {
    grossRevenue: gross,
    revenueSharePct: instructor.revenueSharePct,
    earnedShare,
    availableBalance: Math.max(0, earnedShare - alreadyReserved),
  };
}
