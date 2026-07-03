import type { Metadata } from "next";
import { prisma } from "@/lib/prisma";
import { BlogCard } from "@/components/blog/blog-card";

export const metadata: Metadata = {
  title: "Blog — EduViet",
  description: "Chia sẻ kiến thức, mẹo học tập và tin tức mới nhất từ EduViet.",
};

export default async function BlogPage() {
  const posts = await prisma.blogPost.findMany({
    where: { status: "PUBLISHED" },
    include: { author: true },
    orderBy: { publishedAt: "desc" },
    take: 50,
  });

  return (
    <div className="container py-10">
      <h1 className="text-3xl font-bold mb-2">Blog</h1>
      <p className="text-muted-foreground mb-8">Kiến thức, mẹo học tập và tin tức mới nhất từ EduViet.</p>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {posts.map((post) => (
          <BlogCard
            key={post.slug}
            post={{
              slug: post.slug,
              title: post.title,
              excerpt: post.excerpt,
              coverImageUrl: post.coverImageUrl,
              authorName: post.author.name,
              publishedAt: post.publishedAt,
            }}
          />
        ))}
        {posts.length === 0 && (
          <p className="text-muted-foreground col-span-full text-center py-12">Chưa có bài viết nào.</p>
        )}
      </div>
    </div>
  );
}
