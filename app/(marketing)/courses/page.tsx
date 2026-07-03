import { cache } from "react";
import type { Metadata } from "next";
import { Prisma } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { CourseCard } from "@/components/course/course-card";
import { CourseFilters } from "@/components/course/course-filters";
import { Pagination } from "@/components/course/pagination";

const PAGE_SIZE = 8;
// Số khóa học lấy tối đa từ DB trước khi lọc theo đánh giá & phân trang ở JS —
// đủ dùng cho quy mô demo/MVP, tránh phải viết raw SQL cho aggregate rating.
const FETCH_CAP = 300;

type SearchParams = {
  q?: string;
  category?: string;
  level?: string;
  instructor?: string;
  rating?: string;
  tag?: string;
  sort?: string;
  page?: string;
};

// cache() để generateMetadata và page component dùng chung 1 lần query danh mục.
const getCategoryBySlug = cache(async (slug: string) => {
  return prisma.category.findUnique({ where: { slug }, include: { children: true } });
});

export async function generateMetadata({ searchParams }: { searchParams: SearchParams }): Promise<Metadata> {
  if (!searchParams.category) {
    return {
      title: "Tất cả khóa học — EduViet",
      description: "Khám phá hàng nghìn khóa học video chất lượng từ các giảng viên hàng đầu Việt Nam.",
    };
  }

  const category = await getCategoryBySlug(searchParams.category);
  if (!category) {
    return { title: "Tất cả khóa học — EduViet" };
  }

  return {
    title: category.metaTitle || `Khóa học ${category.name} — EduViet`,
    description:
      category.description || `Khám phá các khóa học ${category.name} chất lượng, học trọn đời tại EduViet.`,
  };
}

async function getCourses(searchParams: SearchParams) {
  const where: Prisma.CourseWhereInput = { status: "PUBLISHED" };

  if (searchParams.q) {
    where.OR = [
      { title: { contains: searchParams.q, mode: "insensitive" } },
      { instructor: { name: { contains: searchParams.q, mode: "insensitive" } } },
    ];
  }
  if (searchParams.category) {
    // Nếu là danh mục cha (có danh mục con), lọc luôn theo cả các danh mục con bên trong.
    const category = await getCategoryBySlug(searchParams.category);
    const slugs = category?.children.length
      ? [category.slug, ...category.children.map((c) => c.slug)]
      : [searchParams.category];
    where.category = { slug: { in: slugs } };
  }
  if (searchParams.level) {
    where.level = searchParams.level as Prisma.EnumCourseLevelFilter["equals"];
  }
  if (searchParams.instructor) {
    where.instructorId = searchParams.instructor;
  }
  if (searchParams.tag) {
    where.tags = { some: { slug: searchParams.tag } };
  }

  const orderBy: Prisma.CourseOrderByWithRelationInput =
    searchParams.sort === "price_asc"
      ? { price: "asc" }
      : searchParams.sort === "price_desc"
      ? { price: "desc" }
      : { createdAt: "desc" };

  return prisma.course.findMany({
    where,
    orderBy,
    take: FETCH_CAP,
    include: { instructor: true, reviews: true },
  });
}

export default async function CoursesPage({ searchParams }: { searchParams: SearchParams }) {
  const [courses, categories, instructors, activeCategory] = await Promise.all([
    getCourses(searchParams),
    prisma.category.findMany({
      where: { parentId: null },
      include: { children: { orderBy: { name: "asc" } } },
      orderBy: { name: "asc" },
    }),
    prisma.user.findMany({
      where: { role: "INSTRUCTOR", coursesTeaching: { some: { status: "PUBLISHED" } } },
      select: { id: true, name: true },
      orderBy: { name: "asc" },
    }),
    searchParams.category ? getCategoryBySlug(searchParams.category) : Promise.resolve(null),
  ]);

  const withRating = courses.map((c) => ({
    ...c,
    avgRating: c.reviews.length ? c.reviews.reduce((sum, r) => sum + r.rating, 0) / c.reviews.length : 0,
  }));

  const minRating = searchParams.rating ? Number(searchParams.rating) : 0;
  let filtered = minRating ? withRating.filter((c) => c.avgRating >= minRating) : withRating;

  if (searchParams.sort === "rating_desc") {
    filtered = [...filtered].sort((a, b) => b.avgRating - a.avgRating);
  }

  const currentPage = Math.max(1, Number(searchParams.page) || 1);
  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const pageItems = filtered.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE);

  return (
    <div className="container py-10">
      <h1 className="text-3xl font-bold mb-2">{activeCategory ? activeCategory.name : "Tất cả khóa học"}</h1>
      {activeCategory?.description && (
        <p className="text-muted-foreground mb-6 max-w-2xl">{activeCategory.description}</p>
      )}
      <CourseFilters categories={categories} instructors={instructors} />

      <p className="text-sm text-muted-foreground mb-4">{filtered.length} khóa học</p>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {pageItems.map((c) => (
          <CourseCard
            key={c.slug}
            course={{
              slug: c.slug,
              title: c.title,
              coverImageUrl: c.coverImageUrl,
              price: Number(c.price),
              discountPrice: c.discountPrice ? Number(c.discountPrice) : null,
              level: c.level,
              instructorName: c.instructor.name,
              avgRating: c.avgRating,
              reviewCount: c.reviews.length,
            }}
          />
        ))}
        {filtered.length === 0 && (
          <p className="text-muted-foreground col-span-full text-center py-12">
            Không tìm thấy khóa học phù hợp.
          </p>
        )}
      </div>

      <Pagination currentPage={currentPage} totalPages={totalPages} />
    </div>
  );
}
