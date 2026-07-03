import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { CourseCard } from "@/components/course/course-card";
import { HeroSlider } from "@/components/marketing/hero-slider";
import { CopyCouponButton } from "@/components/marketing/copy-coupon-button";
import { BlockList } from "@/components/page-builder/block-renderer";
import type { PageBlock } from "@/lib/blocks";
import {
  ArrowRight,
  Tag,
  BookOpen,
  Users,
  GraduationCap,
  Star,
  Infinity as InfinityIcon,
  Award,
  Smartphone,
  ShieldCheck,
  Briefcase,
  TrendingUp,
  Palette,
  Monitor,
  Languages,
  Quote,
  type LucideIcon,
} from "lucide-react";

const categoryIconMap: Record<string, LucideIcon> = {
  Briefcase,
  TrendingUp,
  Palette,
  Monitor,
  Languages,
};

async function getFeaturedCourses() {
  const courses = await prisma.course.findMany({
    where: { status: "PUBLISHED" },
    include: {
      instructor: true,
      reviews: true,
    },
    orderBy: { createdAt: "desc" },
    take: 8,
  });

  return courses.map((c) => ({
    slug: c.slug,
    title: c.title,
    coverImageUrl: c.coverImageUrl,
    price: Number(c.price),
    discountPrice: c.discountPrice ? Number(c.discountPrice) : null,
    level: c.level,
    instructorName: c.instructor.name,
    avgRating: c.reviews.length
      ? c.reviews.reduce((sum, r) => sum + r.rating, 0) / c.reviews.length
      : 0,
    reviewCount: c.reviews.length,
  }));
}

async function getCategories() {
  const categories = await prisma.category.findMany({
    where: { parentId: null },
    include: {
      _count: { select: { courses: true } },
      children: { include: { _count: { select: { courses: true } } } },
    },
    orderBy: { name: "asc" },
  });

  return categories.map((cat) => ({
    ...cat,
    courseCount: cat._count.courses + cat.children.reduce((sum, c) => sum + c._count.courses, 0),
  }));
}

async function getHeroImages() {
  const courses = await prisma.course.findMany({
    where: { status: "PUBLISHED", coverImageUrl: { not: null } },
    select: { coverImageUrl: true },
    orderBy: { createdAt: "desc" },
    take: 5,
  });
  return courses.map((c) => c.coverImageUrl!);
}

async function getStats() {
  const [courseCount, instructorCount, enrollments, ratingAgg] = await Promise.all([
    prisma.course.count({ where: { status: "PUBLISHED" } }),
    prisma.user.count({ where: { role: "INSTRUCTOR" } }),
    prisma.enrollment.findMany({ distinct: ["userId"], select: { userId: true } }),
    prisma.review.aggregate({ _avg: { rating: true } }),
  ]);

  return {
    courseCount,
    instructorCount,
    studentCount: enrollments.length,
    avgRating: ratingAgg._avg.rating ?? 0,
  };
}

// "trang-chu" là trang hệ thống trong UX Builder — chỉ dùng để admin chèn thêm khối tùy chỉnh
// (banner, CTA, văn bản...) phía trên/dưới các phần động sẵn có của trang chủ, không thay thế chúng.
async function getHomepageCustomBlocks() {
  const page = await prisma.page.findUnique({ where: { slug: "trang-chu", status: "PUBLISHED" } });
  if (!page) return { top: [] as PageBlock[], bottom: [] as PageBlock[] };

  const blocks = page.blocks as unknown as PageBlock[];
  return {
    top: blocks.filter((b) => b.slot === "top"),
    bottom: blocks.filter((b) => b.slot !== "top"),
  };
}

async function getFeaturedInstructors() {
  const instructors = await prisma.user.findMany({
    where: { role: "INSTRUCTOR" },
    include: {
      coursesTeaching: {
        where: { status: "PUBLISHED" },
        include: { enrollments: true, reviews: true },
      },
    },
    take: 4,
  });

  return instructors
    .map((ins) => {
      const studentCount = ins.coursesTeaching.reduce((sum, c) => sum + c.enrollments.length, 0);
      const allRatings = ins.coursesTeaching.flatMap((c) => c.reviews.map((r) => r.rating));
      const avgRating = allRatings.length ? allRatings.reduce((a, b) => a + b, 0) / allRatings.length : 0;
      return {
        id: ins.id,
        name: ins.name,
        bio: ins.bio,
        avatarUrl: ins.avatarUrl,
        courseCount: ins.coursesTeaching.length,
        studentCount,
        avgRating,
      };
    })
    .filter((ins) => ins.courseCount > 0)
    .sort((a, b) => b.studentCount - a.studentCount);
}

async function getActivePromotions() {
  const coupons = await prisma.coupon.findMany({
    where: {
      isActive: true,
      OR: [{ expiresAt: null }, { expiresAt: { gt: new Date() } }],
    },
    orderBy: { discountPct: "desc" },
  });

  return coupons.filter((c) => c.maxUses === null || c.usedCount < c.maxUses).slice(0, 3);
}

async function getTestimonials() {
  const reviews = await prisma.review.findMany({
    where: { rating: { gte: 4 }, comment: { not: null } },
    include: { user: true, course: true },
    orderBy: [{ rating: "desc" }, { createdAt: "desc" }],
    take: 4,
  });

  return reviews.map((r) => ({
    id: r.id,
    comment: r.comment!,
    userName: r.user.name,
    userAvatarUrl: r.user.avatarUrl,
    courseTitle: r.course.title,
    courseSlug: r.course.slug,
  }));
}

const benefits = [
  {
    icon: InfinityIcon,
    title: "Học trọn đời",
    description: "Mua 1 lần, học mãi mãi — không giới hạn thời gian truy cập.",
  },
  {
    icon: Award,
    title: "Chứng chỉ hoàn thành",
    description: "Nhận chứng chỉ ngay khi hoàn thành 100% khóa học.",
  },
  {
    icon: Smartphone,
    title: "Học mọi lúc mọi nơi",
    description: "Tương thích mọi thiết bị, tự động lưu tiến độ học.",
  },
  {
    icon: ShieldCheck,
    title: "Giảng viên được kiểm duyệt",
    description: "Mọi khóa học đều qua admin xét duyệt trước khi xuất bản.",
  },
];

export default async function HomePage() {
  const [courses, categories, stats, instructors, heroImages, customBlocks, testimonials, promotions] =
    await Promise.all([
      getFeaturedCourses(),
      getCategories(),
      getStats(),
      getFeaturedInstructors(),
      getHeroImages(),
      getHomepageCustomBlocks(),
      getTestimonials(),
      getActivePromotions(),
    ]);

  return (
    <div>
      <BlockList blocks={customBlocks.top} />

      <section className="relative overflow-hidden bg-secondary/30">
        <HeroSlider images={heroImages} />
        <div className="container relative z-10 grid min-h-[420px] gap-8 py-20 md:grid-cols-2 items-center">
          <div className="rounded-2xl bg-background/85 p-6 shadow-xl backdrop-blur-sm md:p-8">
            <h1 className="text-4xl md:text-5xl font-bold leading-tight">
              Học kỹ năng mới, <span className="text-primary">mua trọn đời</span>, học theo tốc độ của bạn
            </h1>
            <p className="mt-4 text-lg text-foreground/70">
              Hàng nghìn khóa học video từ các chuyên gia hàng đầu Việt Nam. Học mọi lúc, mọi nơi, trên mọi thiết bị.
            </p>
            <div className="mt-8 flex gap-4">
              <Button size="lg" asChild>
                <Link href="/courses">
                  Khám phá khóa học <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
              <Button size="lg" variant="outline" asChild>
                <Link href="/become-instructor">Trở thành giảng viên</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      <section className="border-y bg-secondary/30">
        <div className="container grid grid-cols-2 divide-x divide-y md:grid-cols-4 md:divide-y-0">
          <StatItem icon={BookOpen} value={`${stats.courseCount}+`} label="Khóa học" />
          <StatItem icon={Users} value={`${stats.studentCount}+`} label="Học viên" />
          <StatItem icon={GraduationCap} value={`${stats.instructorCount}+`} label="Giảng viên" />
          <StatItem icon={Star} value={stats.avgRating ? stats.avgRating.toFixed(1) : "—"} label="Đánh giá trung bình" />
        </div>
      </section>

      {promotions.length > 0 && (
        <section className="border-b bg-primary/5">
          <div className="container flex flex-wrap items-center gap-x-6 gap-y-3 py-4">
            <div className="flex items-center gap-2 font-semibold text-primary shrink-0">
              <Tag className="h-4 w-4" />
              Ưu đãi đang diễn ra
            </div>
            {promotions.map((coupon) => (
              <div key={coupon.id} className="flex items-center gap-2 text-sm">
                <span className="text-muted-foreground">
                  Giảm <span className="font-semibold text-foreground">{coupon.discountPct}%</span> với mã
                </span>
                <CopyCouponButton code={coupon.code} />
              </div>
            ))}
          </div>
        </section>
      )}

      <section className="container py-14">
        <h2 className="text-2xl font-bold mb-6">Danh mục nổi bật</h2>
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          {categories.map((cat) => {
            const Icon = (cat.icon && categoryIconMap[cat.icon]) || BookOpen;
            return (
              <Link
                key={cat.id}
                href={`/courses?category=${cat.slug}`}
                className="rounded-lg border p-4 text-center hover:border-primary hover:bg-primary/5 transition-colors"
              >
                <div className="mx-auto mb-3 flex h-11 w-11 items-center justify-center rounded-full bg-primary/10">
                  <Icon className="h-5 w-5 text-primary" />
                </div>
                <p className="font-medium">{cat.name}</p>
                <p className="text-sm text-muted-foreground">{cat.courseCount} khóa học</p>
              </Link>
            );
          })}
        </div>
      </section>

      <section className="container py-14">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold">Khóa học mới nhất</h2>
          <Link href="/courses" className="text-sm font-medium text-primary hover:underline">
            Xem tất cả
          </Link>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {courses.map((c) => (
            <CourseCard key={c.slug} course={c} />
          ))}
          {courses.length === 0 && (
            <p className="text-muted-foreground col-span-full text-center py-12">
              Chưa có khóa học nào được xuất bản. Hãy chạy `npm run db:seed` để có dữ liệu mẫu.
            </p>
          )}
        </div>
      </section>

      <section className="bg-secondary/30 py-14">
        <div className="container">
          <h2 className="text-2xl font-bold mb-10 text-center">Vì sao chọn EduViet</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {benefits.map((b) => (
              <div key={b.title} className="text-center">
                <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
                  <b.icon className="h-6 w-6 text-primary" />
                </div>
                <p className="font-semibold mb-1">{b.title}</p>
                <p className="text-sm text-muted-foreground">{b.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {instructors.length > 0 && (
        <section className="container py-14">
          <h2 className="text-2xl font-bold mb-6">Giảng viên nổi bật</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {instructors.map((ins) => (
              <div key={ins.id} className="rounded-lg border p-6 text-center">
                <Avatar className="mx-auto mb-4 h-16 w-16">
                  {ins.avatarUrl && <AvatarImage src={ins.avatarUrl} alt={ins.name} />}
                  <AvatarFallback>{ins.name.slice(0, 2).toUpperCase()}</AvatarFallback>
                </Avatar>
                <p className="font-semibold">{ins.name}</p>
                {ins.bio && <p className="mt-1 text-xs text-muted-foreground line-clamp-2">{ins.bio}</p>}
                <div className="mt-3 flex items-center justify-center gap-3 text-xs text-muted-foreground">
                  <span>{ins.courseCount} khóa học</span>
                  <span>•</span>
                  <span>{ins.studentCount} học viên</span>
                </div>
                {ins.avgRating > 0 && (
                  <div className="mt-2 flex items-center justify-center gap-1 text-sm">
                    <Star className="h-3.5 w-3.5 fill-yellow-400 text-yellow-400" />
                    <span className="font-medium">{ins.avgRating.toFixed(1)}</span>
                  </div>
                )}
              </div>
            ))}
          </div>
        </section>
      )}

      {testimonials.length > 0 && (
        <section className="container py-14">
          <h2 className="text-2xl font-bold mb-10">
            Hãy cùng tham gia với những học viên đang thay đổi sự nghiệp của họ thông qua việc học tập
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {testimonials.map((t) => (
              <div key={t.id} className="flex flex-col rounded-lg border p-6">
                <Quote className="h-6 w-6 text-primary shrink-0" />
                <p className="mt-3 flex-1 text-sm text-muted-foreground line-clamp-6">{t.comment}</p>
                <div className="mt-5 flex items-center gap-3">
                  <Avatar className="h-9 w-9">
                    {t.userAvatarUrl && <AvatarImage src={t.userAvatarUrl} alt={t.userName} />}
                    <AvatarFallback>{t.userName.slice(0, 2).toUpperCase()}</AvatarFallback>
                  </Avatar>
                  <div className="min-w-0">
                    <p className="text-sm font-medium">{t.userName}</p>
                    <p className="truncate text-xs text-muted-foreground">Đã hoàn thành {t.courseTitle}</p>
                  </div>
                </div>
                <Link
                  href={`/courses/${t.courseSlug}`}
                  className="mt-4 flex items-center gap-1 text-sm font-medium text-primary hover:underline"
                >
                  Xem khóa học này <ArrowRight className="h-3.5 w-3.5" />
                </Link>
              </div>
            ))}
          </div>
          <Link href="/blog" className="mt-8 inline-flex items-center gap-1 font-medium text-primary hover:underline">
            Xem tất cả các bài viết <ArrowRight className="h-4 w-4" />
          </Link>
        </section>
      )}

      <section className="container pb-20">
        <div className="rounded-2xl bg-primary px-8 py-14 text-center text-primary-foreground">
          <h2 className="text-3xl font-bold">Sẵn sàng bắt đầu hành trình học tập?</h2>
          <p className="mt-3 text-primary-foreground/90">
            Tham gia cùng hàng nghìn học viên đang nâng cao kỹ năng mỗi ngày trên EduViet.
          </p>
          <div className="mt-8 flex justify-center gap-4">
            <Button size="lg" variant="secondary" asChild>
              <Link href="/courses">Khám phá khóa học</Link>
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="border-primary-foreground/40 bg-transparent text-primary-foreground hover:bg-primary-foreground/10 hover:text-primary-foreground"
              asChild
            >
              <Link href="/become-instructor">Trở thành giảng viên</Link>
            </Button>
          </div>
        </div>
      </section>

      <BlockList blocks={customBlocks.bottom} />
    </div>
  );
}

function StatItem({
  icon: Icon,
  value,
  label,
}: {
  icon: typeof BookOpen;
  value: string;
  label: string;
}) {
  return (
    <div className="flex flex-col items-center gap-1 py-8 text-center">
      <Icon className="h-5 w-5 text-primary mb-1" />
      <p className="text-2xl font-bold">{value}</p>
      <p className="text-sm text-muted-foreground">{label}</p>
    </div>
  );
}
