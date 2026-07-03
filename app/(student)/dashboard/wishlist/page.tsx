import { requireUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { CourseCard } from "@/components/course/course-card";
import { RemoveWishlistButton } from "@/components/course/remove-wishlist-button";

export default async function WishlistPage() {
  const user = await requireUser();

  const wishlist = await prisma.wishlist.findMany({
    where: { userId: user.id },
    include: { course: { include: { instructor: true, reviews: true } } },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Khóa học yêu thích</h1>

      {wishlist.length === 0 ? (
        <p className="text-muted-foreground">Bạn chưa lưu khóa học nào vào danh sách yêu thích.</p>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {wishlist.map((w) => (
            <div key={w.id} className="relative">
              <RemoveWishlistButton courseId={w.courseId} />
              <CourseCard
                course={{
                  slug: w.course.slug,
                  title: w.course.title,
                  coverImageUrl: w.course.coverImageUrl,
                  price: Number(w.course.price),
                  discountPrice: w.course.discountPrice ? Number(w.course.discountPrice) : null,
                  level: w.course.level,
                  instructorName: w.course.instructor.name,
                  avgRating: w.course.reviews.length
                    ? w.course.reviews.reduce((s, r) => s + r.rating, 0) / w.course.reviews.length
                    : 0,
                  reviewCount: w.course.reviews.length,
                }}
              />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
