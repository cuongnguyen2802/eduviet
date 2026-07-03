import Image from "next/image";
import Link from "next/link";
import { requireUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ReviewDialog } from "@/components/course/review-dialog";

export default async function StudentDashboardPage() {
  const user = await requireUser();

  const enrollments = await prisma.enrollment.findMany({
    where: { userId: user.id },
    include: { course: true },
    orderBy: { purchasedAt: "desc" },
  });

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Khóa học của tôi</h1>

      {enrollments.length === 0 ? (
        <Card>
          <CardContent className="p-10 text-center">
            <p className="text-muted-foreground mb-4">Bạn chưa mua khóa học nào.</p>
            <Button asChild>
              <Link href="/courses">Khám phá khóa học</Link>
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {enrollments.map((e) => (
            <Card key={e.id} className="overflow-hidden">
              <div className="relative aspect-video bg-muted">
                {e.course.coverImageUrl && (
                  <Image src={e.course.coverImageUrl} alt={e.course.title} fill className="object-cover" />
                )}
              </div>
              <CardContent className="p-4 space-y-3">
                <h3 className="font-semibold line-clamp-2">{e.course.title}</h3>
                <div>
                  <div className="flex items-center justify-between text-xs text-muted-foreground mb-1">
                    <span>Tiến độ</span>
                    <span>{e.progressPct}%</span>
                  </div>
                  <Progress value={e.progressPct} />
                </div>
                <Button asChild className="w-full" size="sm">
                  <Link href={`/learn/${e.courseId}`}>
                    {e.progressPct > 0 ? "Tiếp tục học" : "Bắt đầu học"}
                  </Link>
                </Button>
                {e.progressPct === 100 && (
                  <Button asChild variant="secondary" className="w-full" size="sm">
                    <Link href={`/dashboard/certificate/${e.courseId}`}>Xem chứng chỉ</Link>
                  </Button>
                )}
                <ReviewDialog courseId={e.courseId} courseTitle={e.course.title} />
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
