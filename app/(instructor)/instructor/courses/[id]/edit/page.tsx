import { notFound } from "next/navigation";
import { requireRole } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { getLeafCategories } from "@/lib/categories";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CourseInfoForm } from "@/components/instructor/course-info-form";
import { CurriculumEditor } from "@/components/instructor/curriculum-editor";
import { SubmitReviewButton } from "@/components/instructor/submit-review-button";

const statusLabel: Record<string, string> = {
  DRAFT: "Bản nháp",
  PENDING_REVIEW: "Chờ duyệt",
  PUBLISHED: "Đã xuất bản",
  REJECTED: "Bị từ chối",
};

export default async function EditCoursePage({ params }: { params: { id: string } }) {
  const instructor = await requireRole(["INSTRUCTOR", "ADMIN"]);

  const [course, categories, tags] = await Promise.all([
    prisma.course.findUnique({
      where: { id: params.id },
      include: {
        sections: { orderBy: { order: "asc" }, include: { lessons: { orderBy: { order: "asc" } } } },
        tags: true,
      },
    }),
    getLeafCategories(),
    prisma.tag.findMany({ orderBy: { name: "asc" } }),
  ]);

  if (!course) notFound();
  if (course.instructorId !== instructor.id && instructor.role !== "ADMIN") notFound();

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold">{course.title}</h1>
          <Badge variant="secondary" className="mt-1">
            {statusLabel[course.status]}
          </Badge>
        </div>
        {(course.status === "DRAFT" || course.status === "REJECTED") && (
          <SubmitReviewButton courseId={course.id} />
        )}
      </div>

      {course.status === "REJECTED" && course.rejectReason && (
        <div className="mb-6 rounded-lg border border-destructive/40 bg-destructive/5 p-4 text-sm">
          <p className="font-medium text-destructive">Lý do từ chối:</p>
          <p className="mt-1">{course.rejectReason}</p>
        </div>
      )}

      <Tabs defaultValue="info">
        <TabsList>
          <TabsTrigger value="info">Thông tin</TabsTrigger>
          <TabsTrigger value="curriculum">Nội dung khóa học</TabsTrigger>
        </TabsList>
        <TabsContent value="info" className="pt-4">
          <CourseInfoForm
            course={course}
            categories={categories}
            tags={tags}
            selectedTagIds={course.tags.map((t) => t.id)}
          />
        </TabsContent>
        <TabsContent value="curriculum" className="pt-4">
          <CurriculumEditor courseId={course.id} sections={course.sections} />
        </TabsContent>
      </Tabs>
    </div>
  );
}
