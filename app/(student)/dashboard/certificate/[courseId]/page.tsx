import { notFound } from "next/navigation";
import { requireUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { PrintButton } from "@/components/course/print-button";

export default async function CertificatePage({ params }: { params: { courseId: string } }) {
  const user = await requireUser();

  const enrollment = await prisma.enrollment.findUnique({
    where: { userId_courseId: { userId: user.id, courseId: params.courseId } },
    include: { course: { include: { instructor: true } } },
  });

  if (!enrollment || enrollment.progressPct !== 100 || !enrollment.completedAt) notFound();

  return (
    <div className="flex flex-col items-center gap-6 py-6">
      <div className="w-full max-w-3xl aspect-[1.414/1] border-8 border-primary/20 bg-background p-12 flex flex-col items-center justify-center text-center print:border-0">
        <p className="text-sm uppercase tracking-widest text-muted-foreground">Chứng chỉ hoàn thành</p>
        <h1 className="text-4xl font-bold mt-4 text-primary">{enrollment.course.title}</h1>
        <p className="mt-8 text-lg">Chứng nhận</p>
        <p className="text-2xl font-semibold mt-1">{user.name}</p>
        <p className="mt-4 text-muted-foreground">
          đã hoàn thành xuất sắc khóa học vào ngày{" "}
          {enrollment.completedAt.toLocaleDateString("vi-VN")}
        </p>
        <div className="mt-12 flex w-full justify-between text-sm text-muted-foreground px-8">
          <div>
            <p className="font-medium text-foreground">{enrollment.course.instructor.name}</p>
            <p>Giảng viên</p>
          </div>
          <div>
            <p className="font-medium text-foreground">EduViet</p>
            <p>Nền tảng học trực tuyến</p>
          </div>
        </div>
      </div>
      <PrintButton />
    </div>
  );
}
