import { Users, BookOpen, Wallet, ShoppingCart } from "lucide-react";
import { prisma } from "@/lib/prisma";
import { formatVND } from "@/lib/format";
import { StatCard } from "@/components/dashboard/stat-card";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

function monthKey(date: Date) {
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}`;
}

function monthLabel(key: string) {
  const [year, month] = key.split("-");
  return `Tháng ${Number(month)}/${year}`;
}

export default async function AdminDashboardPage() {
  const [userCount, courseCount, paidOrders, pendingCourses] = await Promise.all([
    prisma.user.count(),
    prisma.course.count(),
    prisma.order.findMany({
      where: { status: "PAID" },
      include: { items: { include: { course: { include: { instructor: true } } } } },
    }),
    prisma.course.count({ where: { status: "PENDING_REVIEW" } }),
  ]);

  const totalRevenue = paidOrders.reduce((sum, o) => sum + Number(o.totalAmount), 0);

  const revenueByCourse = new Map<string, number>();
  const revenueByInstructor = new Map<string, number>();
  const revenueByMonth = new Map<string, number>();

  for (const order of paidOrders) {
    const key = monthKey(order.createdAt);
    revenueByMonth.set(key, (revenueByMonth.get(key) ?? 0) + Number(order.totalAmount));

    for (const item of order.items) {
      revenueByCourse.set(item.course.title, (revenueByCourse.get(item.course.title) ?? 0) + Number(item.price));
      revenueByInstructor.set(
        item.course.instructor.name,
        (revenueByInstructor.get(item.course.instructor.name) ?? 0) + Number(item.price)
      );
    }
  }

  const topCourses = [...revenueByCourse.entries()].sort((a, b) => b[1] - a[1]).slice(0, 5);
  const topInstructors = [...revenueByInstructor.entries()].sort((a, b) => b[1] - a[1]).slice(0, 5);

  // 6 tháng gần nhất, kể cả tháng chưa có doanh thu, để biểu đồ liền mạch theo thời gian.
  const last6Months: string[] = [];
  const cursor = new Date();
  for (let i = 5; i >= 0; i--) {
    const d = new Date(cursor.getFullYear(), cursor.getMonth() - i, 1);
    last6Months.push(monthKey(d));
  }

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Tổng quan hệ thống</h1>
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
        <StatCard label="Người dùng" value={String(userCount)} icon={Users} />
        <StatCard label="Khóa học" value={String(courseCount)} icon={BookOpen} />
        <StatCard label="Đơn hàng đã thanh toán" value={String(paidOrders.length)} icon={ShoppingCart} />
        <StatCard label="Tổng doanh thu" value={formatVND(totalRevenue)} icon={Wallet} />
      </div>

      {pendingCourses > 0 && (
        <div className="mb-6 rounded-lg border bg-secondary/40 p-4 text-sm">
          Có <span className="font-semibold">{pendingCourses}</span> khóa học đang chờ duyệt.
        </div>
      )}

      <div className="grid lg:grid-cols-3 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Doanh thu theo tháng</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {last6Months.map((key) => (
              <div key={key} className="flex items-center justify-between text-sm border-b pb-2 last:border-0">
                <span>{monthLabel(key)}</span>
                <span className="font-semibold text-primary">{formatVND(revenueByMonth.get(key) ?? 0)}</span>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Top khóa học theo doanh thu</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {topCourses.map(([title, revenue]) => (
              <div key={title} className="flex items-center justify-between text-sm border-b pb-2 last:border-0">
                <span className="line-clamp-1">{title}</span>
                <span className="font-semibold text-primary shrink-0 ml-2">{formatVND(revenue)}</span>
              </div>
            ))}
            {topCourses.length === 0 && <p className="text-muted-foreground">Chưa có dữ liệu doanh thu.</p>}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Doanh thu theo giảng viên</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {topInstructors.map(([name, revenue]) => (
              <div key={name} className="flex items-center justify-between text-sm border-b pb-2 last:border-0">
                <span className="line-clamp-1">{name}</span>
                <span className="font-semibold text-primary shrink-0 ml-2">{formatVND(revenue)}</span>
              </div>
            ))}
            {topInstructors.length === 0 && <p className="text-muted-foreground">Chưa có dữ liệu doanh thu.</p>}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
