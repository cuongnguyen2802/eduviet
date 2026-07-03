import { cache } from "react";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import Image from "next/image";
import { Star, Users, BarChart, Award, Infinity as InfinityIcon, ShieldCheck, Clock } from "lucide-react";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";
import { formatVND } from "@/lib/format";
import { stripHtml } from "@/lib/sanitize";
import { RichContent } from "@/components/shared/rich-content";
import { CourseCurriculum } from "@/components/course/course-curriculum";
import { AddToCartButton } from "@/components/course/add-to-cart-button";
import { BuyNowButton } from "@/components/course/buy-now-button";
import { WishlistButton } from "@/components/course/wishlist-button";
import { ShareButton } from "@/components/course/share-button";
import { VideoPlayer } from "@/components/course/video-player";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Breadcrumb } from "@/components/ui/breadcrumb";
import { Button } from "@/components/ui/button";
import Link from "next/link";

// cache() để generateMetadata và page component dùng chung 1 lần query thay vì gọi 2 lần.
const getCourse = cache(async (slug: string) => {
  return prisma.course.findUnique({
    where: { slug, status: "PUBLISHED" },
    include: {
      instructor: true,
      category: { include: { parent: true } },
      tags: true,
      sections: { orderBy: { order: "asc" }, include: { lessons: { orderBy: { order: "asc" } } } },
      reviews: { include: { user: true }, orderBy: { createdAt: "desc" }, take: 10 },
    },
  });
});

export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  const course = await getCourse(params.slug);
  if (!course) return { title: "Không tìm thấy khóa học — EduViet" };

  const description = stripHtml(course.description).slice(0, 155);

  return {
    title: `${course.title} — EduViet`,
    description,
    openGraph: {
      title: course.title,
      description,
      images: course.coverImageUrl ? [course.coverImageUrl] : undefined,
    },
  };
}

const levelLabel: Record<string, string> = {
  BEGINNER: "Cơ bản",
  INTERMEDIATE: "Trung cấp",
  ADVANCED: "Nâng cao",
};

export default async function CourseDetailPage({ params }: { params: { slug: string } }) {
  const course = await getCourse(params.slug);
  if (!course) notFound();

  const user = await getCurrentUser();
  const enrollment = user
    ? await prisma.enrollment.findUnique({
        where: { userId_courseId: { userId: user.id, courseId: course.id } },
      })
    : null;

  const wishlistEntry = user
    ? await prisma.wishlist.findUnique({
        where: { userId_courseId: { userId: user.id, courseId: course.id } },
      })
    : null;
  const isWishlisted = !!wishlistEntry;

  const previewLesson = course.sections.flatMap((s) => s.lessons).find((l) => l.isPreview && l.youtubeVideoId);
  const avgRating = course.reviews.length
    ? course.reviews.reduce((sum, r) => sum + r.rating, 0) / course.reviews.length
    : 0;
  const studentCount = await prisma.enrollment.count({ where: { courseId: course.id } });

  const price = Number(course.price);
  const discountPrice = course.discountPrice ? Number(course.discountPrice) : null;
  const discountPct = discountPrice ? Math.round((1 - discountPrice / price) * 100) : 0;

  const cartItem = {
    courseId: course.id,
    title: course.title,
    slug: course.slug,
    price,
    discountPrice,
    coverImageUrl: course.coverImageUrl,
  };

  return (
    <div>
      <div className="bg-slate-900 text-slate-100">
        <div className="container pt-6">
          <Breadcrumb
            items={[
              { label: "Trang chủ", href: "/" },
              ...(course.category.parent
                ? [{ label: course.category.parent.name, href: `/courses?category=${course.category.parent.slug}` }]
                : []),
              { label: course.category.name, href: `/courses?category=${course.category.slug}` },
              { label: course.title },
            ]}
          />
        </div>

        <div className="container pb-20 pt-4">
          <div className="lg:max-w-2xl">
            <h1 className="text-3xl font-bold leading-tight">{course.title}</h1>
            <RichContent html={course.description} className="prose prose-sm prose-invert max-w-none mt-3 text-slate-300" />

            <div className="flex flex-wrap items-center gap-x-4 gap-y-2 mt-5 text-sm">
              <div className="flex items-center gap-1.5 rounded bg-yellow-400/10 px-2 py-1">
                <span className="font-bold text-yellow-400">{avgRating.toFixed(1)}</span>
                <div className="flex items-center gap-0.5">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star
                      key={i}
                      className={`h-3.5 w-3.5 ${i < Math.round(avgRating) ? "fill-yellow-400 text-yellow-400" : "text-slate-500"}`}
                    />
                  ))}
                </div>
                <span className="text-slate-400">({course.reviews.length} đánh giá)</span>
              </div>
              <div className="flex items-center gap-1 text-slate-400">
                <Users className="h-4 w-4" /> {studentCount} học viên
              </div>
              <div className="flex items-center gap-1 text-slate-400">
                <BarChart className="h-4 w-4" /> {levelLabel[course.level] ?? course.level}
              </div>
            </div>

            <p className="mt-3 text-sm text-slate-400">
              Giảng viên: <span className="font-medium text-slate-200">{course.instructor.name}</span> • Cập nhật{" "}
              {course.updatedAt.toLocaleDateString("vi-VN", { month: "2-digit", year: "numeric" })}
            </p>

            {course.tags.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-5">
                {course.tags.map((tag) => (
                  <Link key={tag.id} href={`/courses?tag=${tag.slug}`}>
                    <Badge variant="outline" className="border-slate-600 text-slate-300 hover:border-primary hover:text-primary">
                      #{tag.name}
                    </Badge>
                  </Link>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="container py-10 grid lg:grid-cols-3 gap-10">
        <div className="lg:col-span-2 space-y-10">
          {course.learnOutcomes.length > 0 && (
            <section className="rounded-lg border p-6">
              <h2 className="text-xl font-bold mb-4">Bạn sẽ học được gì</h2>
              <ul className="grid sm:grid-cols-2 gap-2">
                {course.learnOutcomes.map((o, i) => (
                  <li key={i} className="flex items-start gap-2 text-sm">
                    <span className="text-primary">✓</span> {o}
                  </li>
                ))}
              </ul>
            </section>
          )}

          <section>
            <h2 className="text-xl font-bold mb-4">Nội dung khóa học</h2>
            <CourseCurriculum sections={course.sections} />
          </section>

          <section className="flex items-center gap-4 rounded-lg border bg-primary/5 p-5">
            <Award className="h-9 w-9 text-primary shrink-0" />
            <div>
              <p className="font-semibold">Nhận chứng chỉ hoàn thành</p>
              <p className="text-sm text-muted-foreground">
                Hoàn thành 100% bài học để nhận chứng chỉ có thể tải về và chia sẻ.
              </p>
            </div>
          </section>

          <section>
            <div className="flex items-center gap-3 mb-4">
              <h2 className="text-xl font-bold">Đánh giá từ học viên</h2>
              {course.reviews.length > 0 && (
                <div className="flex items-center gap-1 text-sm">
                  <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                  <span className="font-medium">{avgRating.toFixed(1)}</span>
                  <span className="text-muted-foreground">({course.reviews.length})</span>
                </div>
              )}
            </div>
            <div className="space-y-4">
              {course.reviews.map((r) => (
                <div key={r.id} className="border-b pb-4">
                  <div className="flex items-center gap-2">
                    <Avatar className="h-8 w-8">
                      <AvatarFallback>{r.user.name.slice(0, 2).toUpperCase()}</AvatarFallback>
                    </Avatar>
                    <p className="font-medium text-sm">{r.user.name}</p>
                    <div className="flex items-center gap-0.5 text-yellow-400">
                      {Array.from({ length: r.rating }).map((_, i) => (
                        <Star key={i} className="h-3.5 w-3.5 fill-yellow-400" />
                      ))}
                    </div>
                  </div>
                  {r.comment && <p className="text-sm text-muted-foreground mt-2">{r.comment}</p>}
                </div>
              ))}
              {course.reviews.length === 0 && (
                <p className="text-sm text-muted-foreground">Chưa có đánh giá nào.</p>
              )}
            </div>
          </section>
        </div>

        <div className="lg:col-start-3 space-y-4">
          <div className="rounded-lg border bg-background overflow-hidden shadow-lg sticky top-20 lg:-mt-64">
            {previewLesson?.youtubeVideoId ? (
              <VideoPlayer youtubeVideoId={previewLesson.youtubeVideoId} />
            ) : (
              <div className="relative aspect-video bg-muted">
                {course.coverImageUrl && (
                  <Image src={course.coverImageUrl} alt={course.title} fill className="object-cover" />
                )}
              </div>
            )}
            <div className="p-5">
              <div className="flex items-center gap-2 mb-1">
                <span className="text-2xl font-bold">{formatVND(discountPrice ?? price)}</span>
                {discountPrice && (
                  <>
                    <span className="text-muted-foreground line-through text-sm">{formatVND(price)}</span>
                    <Badge className="bg-destructive text-destructive-foreground">-{discountPct}%</Badge>
                  </>
                )}
              </div>

              {enrollment ? (
                <Button size="lg" className="w-full mt-4" asChild>
                  <Link href={`/learn/${course.id}`}>Vào học ngay</Link>
                </Button>
              ) : (
                <div className="space-y-2 mt-4">
                  <BuyNowButton course={cartItem} />
                  <AddToCartButton course={cartItem} />
                  {user && <WishlistButton courseId={course.id} initialWishlisted={isWishlisted} />}
                </div>
              )}

              <div className="mt-5 space-y-2 text-sm text-muted-foreground">
                <div className="flex items-center gap-2">
                  <InfinityIcon className="h-4 w-4 text-primary shrink-0" /> Mua 1 lần — học trọn đời
                </div>
                <div className="flex items-center gap-2">
                  <Award className="h-4 w-4 text-primary shrink-0" /> Nhận chứng chỉ khi hoàn thành
                </div>
                <div className="flex items-center gap-2">
                  <ShieldCheck className="h-4 w-4 text-primary shrink-0" /> Được hỗ trợ hoàn tiền
                </div>
              </div>

              <div className="mt-4 flex justify-center border-t pt-3">
                <ShareButton title={course.title} />
              </div>
            </div>
          </div>

          <div className="rounded-lg border p-5">
            <p className="font-semibold mb-3">Giảng viên</p>
            <div className="flex items-center gap-3">
              <Avatar>
                <AvatarFallback>{course.instructor.name.slice(0, 2).toUpperCase()}</AvatarFallback>
              </Avatar>
              <div>
                <p className="font-medium text-sm">{course.instructor.name}</p>
                {course.instructor.bio && (
                  <p className="text-xs text-muted-foreground line-clamp-3 mt-1">{course.instructor.bio}</p>
                )}
              </div>
            </div>
          </div>
          <div className="rounded-lg border p-5 flex items-center gap-3 text-sm text-muted-foreground">
            <Clock className="h-4 w-4 shrink-0 text-primary" />
            Cập nhật lần cuối {course.updatedAt.toLocaleDateString("vi-VN")}
          </div>
        </div>
      </div>
    </div>
  );
}
