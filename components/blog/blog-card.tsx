import Image from "next/image";
import Link from "next/link";
import { CalendarDays, Clock } from "lucide-react";

export type BlogCardData = {
  slug: string;
  title: string;
  excerpt: string;
  coverImageUrl: string | null;
  authorName: string;
  publishedAt: Date | null;
  readingMinutes?: number;
};

export function BlogCard({ post }: { post: BlogCardData }) {
  return (
    <Link
      href={`/blog/${post.slug}`}
      className="group flex flex-col rounded-xl border overflow-hidden bg-background hover:shadow-lg hover:-translate-y-0.5 transition-all"
    >
      <div className="relative aspect-video bg-muted overflow-hidden">
        {post.coverImageUrl && (
          <Image
            src={post.coverImageUrl}
            alt={post.title}
            fill
            className="object-cover transition-transform duration-300 group-hover:scale-105"
          />
        )}
      </div>
      <div className="p-5 flex flex-col flex-1">
        <h3 className="font-semibold leading-snug line-clamp-2 group-hover:text-primary transition-colors">
          {post.title}
        </h3>
        <p className="text-sm text-muted-foreground line-clamp-2 mt-2">{post.excerpt}</p>
        <div className="mt-4 pt-4 border-t flex items-center justify-between text-xs text-muted-foreground">
          <span className="truncate">{post.authorName}</span>
          <div className="flex items-center gap-3 shrink-0">
            {post.publishedAt && (
              <span className="flex items-center gap-1">
                <CalendarDays className="h-3 w-3" />
                {post.publishedAt.toLocaleDateString("vi-VN")}
              </span>
            )}
            {post.readingMinutes && (
              <span className="flex items-center gap-1">
                <Clock className="h-3 w-3" />
                {post.readingMinutes} phút
              </span>
            )}
          </div>
        </div>
      </div>
    </Link>
  );
}
