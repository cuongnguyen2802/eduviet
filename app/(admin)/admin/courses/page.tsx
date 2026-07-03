import { prisma } from "@/lib/prisma";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CourseReviewActions } from "@/components/admin/course-review-actions";

const statusLabel: Record<string, string> = {
  DRAFT: "Bản nháp",
  PENDING_REVIEW: "Chờ duyệt",
  PUBLISHED: "Đã xuất bản",
  REJECTED: "Bị từ chối",
};

export default async function AdminCoursesPage() {
  const courses = await prisma.course.findMany({
    include: { instructor: true },
    orderBy: [{ status: "asc" }, { createdAt: "desc" }],
  });

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Duyệt khóa học</h1>
      <div className="space-y-3">
        {courses.map((c) => (
          <Card key={c.id}>
            <CardContent className="p-4 flex items-center justify-between">
              <div>
                <div className="flex items-center gap-2">
                  <p className="font-medium">{c.title}</p>
                  <Badge variant="secondary">{statusLabel[c.status]}</Badge>
                </div>
                <p className="text-sm text-muted-foreground">Giảng viên: {c.instructor.name}</p>
              </div>
              {c.status === "PENDING_REVIEW" && <CourseReviewActions courseId={c.id} />}
            </CardContent>
          </Card>
        ))}
        {courses.length === 0 && <p className="text-muted-foreground text-center py-12">Chưa có khóa học nào.</p>}
      </div>
    </div>
  );
}
