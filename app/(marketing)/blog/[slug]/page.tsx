import { cache } from "react";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { RichContent } from "@/components/shared/rich-content";

const getPost = cache(async (slug: string) => {
  return prisma.blogPost.findUnique({
    where: { slug, status: "PUBLISHED" },
    include: { author: true },
  });
});

export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  const post = await getPost(params.slug);
  if (!post) return { title: "Không tìm thấy bài viết — EduViet" };

  return {
    title: post.metaTitle || `${post.title} — EduViet`,
    description: post.metaDescription || post.excerpt,
    openGraph: {
      title: post.title,
      description: post.excerpt,
      images: post.coverImageUrl ? [post.coverImageUrl] : undefined,
    },
  };
}

export default async function BlogPostPage({ params }: { params: { slug: string } }) {
  const post = await getPost(params.slug);
  if (!post) notFound();

  return (
    <article className="container max-w-3xl py-10">
      <Link href="/blog" className="text-sm text-muted-foreground hover:text-primary">
        ← Quay lại Blog
      </Link>

      <h1 className="text-3xl md:text-4xl font-bold mt-4">{post.title}</h1>

      <div className="flex items-center gap-3 mt-4">
        <Avatar>
          {post.author.avatarUrl && <AvatarImage src={post.author.avatarUrl} alt={post.author.name} />}
          <AvatarFallback>{post.author.name.slice(0, 2).toUpperCase()}</AvatarFallback>
        </Avatar>
        <div>
          <p className="font-medium text-sm">{post.author.name}</p>
          {post.publishedAt && (
            <p className="text-xs text-muted-foreground">{post.publishedAt.toLocaleDateString("vi-VN")}</p>
          )}
        </div>
      </div>

      {post.coverImageUrl && (
        <div className="relative aspect-video mt-8 rounded-lg overflow-hidden bg-muted">
          <Image src={post.coverImageUrl} alt={post.title} fill className="object-cover" priority />
        </div>
      )}

      <RichContent html={post.content} className="prose prose-sm sm:prose-base max-w-none mt-8" />
    </article>
  );
}
