import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { CourseCard } from "@/components/course/course-card";
import { HeroSlider } from "@/components/marketing/hero-slider";
import {
  ArrowRight,
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
  const [courses, categories, stats, instructors, heroImages] = await Promise.all([
    getFeaturedCourses(),
    getCategories(),
    getStats(),
    getFeaturedInstructors(),
    getHeroImages(),
  ]);

  return (
    <div>
      <section className="relative overflow-hidden bg-secondary/30">
        <HeroSlider images={heroImages} />
        <div className="container relative z-10 grid min-h-[420px] gap-8 py-20 md:grid-cols-2 items-center">
          <div className="rounded-2xl bg-background/70 p-6 backdrop-blur-sm md:bg-transparent md:p-0 md:backdrop-blur-none">
            <h1 className="text-4xl md:text-5xl font-bold leading-tight drop-shadow-sm">
              Học kỹ năng mới, <span className="text-primary">mua trọn đời</span>, học theo tốc độ của bạn
            </h1>
            <p className="mt-4 text-lg text-muted-foreground">
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
