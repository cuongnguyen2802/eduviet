import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { CalendarDays, Clock } from "lucide-react";
import { prisma } from "@/lib/prisma";
import { stripHtml } from "@/lib/sanitize";
import { BlogCard } from "@/components/blog/blog-card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";

export const metadata: Metadata = {
  title: "Blog — EduViet",
  description: "Chia sẻ kiến thức, mẹo học tập và tin tức mới nhất từ EduViet.",
};

function readingTime(html: string) {
  const words = stripHtml(html).split(/\s+/).filter(Boolean).length;
  return Math.max(1, Math.round(words / 200));
}

export default async function BlogPage() {
  const posts = await prisma.blogPost.findMany({
    where: { status: "PUBLISHED" },
    include: { author: true },
    orderBy: { publishedAt: "desc" },
    take: 50,
  });

  const [featured, ...rest] = posts;

  return (
    <div>
      <div className="bg-slate-900 text-slate-100">
        <div className="container py-14 text-center">
          <Badge variant="outline" className="border-slate-600 text-slate-300 mb-4">
            Blog
          </Badge>
          <h1 className="text-3xl md:text-4xl font-bold">Kiến thức &amp; cảm hứng học tập</h1>
          <p className="text-slate-400 mt-3 max-w-xl mx-auto">
            Mẹo học tập, xu hướng nghề nghiệp và câu chuyện từ cộng đồng EduViet.
          </p>
        </div>
      </div>

      <div className="container py-10 space-y-12">
        {featured && (
          <Link
            href={`/blog/${featured.slug}`}
            className="group grid md:grid-cols-2 gap-0 items-stretch rounded-2xl border overflow-hidden hover:shadow-lg transition-shadow"
          >
            <div className="relative aspect-video md:aspect-auto bg-muted overflow-hidden">
              {featured.coverImageUrl && (
                <Image
                  src={featured.coverImageUrl}
                  alt={featured.title}
                  fill
                  className="object-cover transition-transform duration-300 group-hover:scale-105"
                  priority
                />
              )}
              <Badge className="absolute top-4 left-4 bg-primary text-primary-foreground">Mới nhất</Badge>
            </div>
            <div className="p-6 md:p-8 flex flex-col justify-center">
              <h2 className="text-2xl font-bold leading-snug group-hover:text-primary transition-colors">
                {featured.title}
              </h2>
              <p className="text-muted-foreground mt-3 line-clamp-3">{featured.excerpt}</p>
              <div className="flex items-center gap-3 mt-6">
                <Avatar className="h-9 w-9">
                  {featured.author.avatarUrl && (
                    <AvatarImage src={featured.author.avatarUrl} alt={featured.author.name} />
                  )}
                  <AvatarFallback>{featured.author.name.slice(0, 2).toUpperCase()}</AvatarFallback>
                </Avatar>
                <div className="text-sm">
                  <p className="font-medium">{featured.author.name}</p>
                  <div className="flex items-center gap-3 text-xs text-muted-foreground mt-0.5">
                    {featured.publishedAt && (
                      <span className="flex items-center gap-1">
                        <CalendarDays className="h-3 w-3" />
                        {featured.publishedAt.toLocaleDateString("vi-VN")}
                      </span>
                    )}
                    <span className="flex items-center gap-1">
                      <Clock className="h-3 w-3" />
                      {readingTime(featured.content)} phút đọc
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </Link>
        )}

        {rest.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {rest.map((post) => (
              <BlogCard
                key={post.slug}
                post={{
                  slug: post.slug,
                  title: post.title,
                  excerpt: post.excerpt,
                  coverImageUrl: post.coverImageUrl,
                  authorName: post.author.name,
                  publishedAt: post.publishedAt,
                  readingMinutes: readingTime(post.content),
                }}
              />
            ))}
          </div>
        )}

        {posts.length === 0 && (
          <p className="text-muted-foreground text-center py-16">Chưa có bài viết nào.</p>
        )}
      </div>
    </div>
  );
}
