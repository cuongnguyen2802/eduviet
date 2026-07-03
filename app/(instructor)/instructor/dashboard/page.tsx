import { BookOpen, Users, Star, Wallet } from "lucide-react";
import { requireRole } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { StatCard } from "@/components/dashboard/stat-card";
import { formatVND } from "@/lib/format";

export default async function InstructorDashboardPage() {
  const instructor = await requireRole(["INSTRUCTOR", "ADMIN"]);

  const courses = await prisma.course.findMany({
    where: { instructorId: instructor.id },
    include: { enrollments: true, reviews: true, orderItems: { include: { order: true } } },
  });

  const totalStudents = courses.reduce((sum, c) => sum + c.enrollments.length, 0);
  const allRatings = courses.flatMap((c) => c.reviews.map((r) => r.rating));
  const avgRating = allRatings.length ? allRatings.reduce((a, b) => a + b, 0) / allRatings.length : 0;
  const revenue = courses.reduce(
    (sum, c) =>
      sum +
      c.orderItems
        .filter((i) => i.order.status === "PAID")
        .reduce((s, i) => s + Number(i.price), 0),
    0
  );

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Tổng quan</h1>
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
        <StatCard label="Khóa học" value={String(courses.length)} icon={BookOpen} />
        <StatCard label="Học viên" value={String(totalStudents)} icon={Users} />
        <StatCard label="Đánh giá trung bình" value={avgRating.toFixed(1)} icon={Star} />
        <StatCard label="Doanh thu" value={formatVND(revenue)} icon={Wallet} />
      </div>
    </div>
  );
}
