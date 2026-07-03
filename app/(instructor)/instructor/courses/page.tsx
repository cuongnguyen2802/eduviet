import Link from "next/link";
import { requireRole } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { getLeafCategories } from "@/lib/categories";
import { NewCourseDialog } from "@/components/forms/new-course-dialog";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { formatVND } from "@/lib/format";

const statusLabel: Record<string, { label: string; variant: "default" | "secondary" | "destructive" | "outline" }> = {
  DRAFT: { label: "Bản nháp", variant: "outline" },
  PENDING_REVIEW: { label: "Chờ duyệt", variant: "secondary" },
  PUBLISHED: { label: "Đã xuất bản", variant: "default" },
  REJECTED: { label: "Bị từ chối", variant: "destructive" },
};

export default async function InstructorCoursesPage() {
  const instructor = await requireRole(["INSTRUCTOR", "ADMIN"]);

  const [courses, categories] = await Promise.all([
    prisma.course.findMany({
      where: { instructorId: instructor.id },
      include: { enrollments: true },
      orderBy: { createdAt: "desc" },
    }),
    getLeafCategories(),
  ]);

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Khóa học của tôi</h1>
        <NewCourseDialog categories={categories} />
      </div>

      <div className="space-y-3">
        {courses.map((c) => (
          <Link key={c.id} href={`/instructor/courses/${c.id}/edit`}>
            <Card className="hover:border-primary transition-colors">
              <CardContent className="p-4 flex items-center justify-between">
                <div>
                  <p className="font-medium">{c.title}</p>
                  <p className="text-sm text-muted-foreground">
                    {c.enrollments.length} học viên • {formatVND(Number(c.discountPrice ?? c.price))}
                  </p>
                </div>
                <Badge variant={statusLabel[c.status].variant}>{statusLabel[c.status].label}</Badge>
              </CardContent>
            </Card>
          </Link>
        ))}
        {courses.length === 0 && (
          <p className="text-muted-foreground text-center py-12">
            Bạn chưa có khóa học nào. Nhấn &quot;Tạo khóa học mới&quot; để bắt đầu.
          </p>
        )}
      </div>
    </div>
  );
}
