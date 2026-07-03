import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { ChevronLeft } from "lucide-react";
import { getCurrentUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { Progress } from "@/components/ui/progress";

export default async function LearnLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: { courseId: string };
}) {
  const user = await getCurrentUser();
  if (!user) redirect("/login");
  if (user.isBanned) redirect("/banned");

  const enrollment = await prisma.enrollment.findUnique({
    where: { userId_courseId: { userId: user.id, courseId: params.courseId } },
    include: { course: true },
  });

  if (!enrollment) notFound();

  return (
    <div className="flex min-h-screen flex-col">
      <header className="flex h-14 items-center justify-between border-b px-4 shrink-0">
        <Link href="/dashboard" className="flex items-center gap-1 text-sm font-medium hover:text-primary">
          <ChevronLeft className="h-4 w-4" /> Thoát
        </Link>
        <p className="font-medium text-sm line-clamp-1">{enrollment.course.title}</p>
        <div className="flex items-center gap-2 w-40">
          <Progress value={enrollment.progressPct} className="h-2" />
          <span className="text-xs text-muted-foreground shrink-0">{enrollment.progressPct}%</span>
        </div>
      </header>
      <div className="flex flex-1">{children}</div>
    </div>
  );
}
