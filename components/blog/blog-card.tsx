import Image from "next/image";
import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";

export type BlogCardData = {
  slug: string;
  title: string;
  excerpt: string;
  coverImageUrl: string | null;
  authorName: string;
  publishedAt: Date | null;
};

export function BlogCard({ post }: { post: BlogCardData }) {
  return (
    <Link href={`/blog/${post.slug}`}>
      <Card className="overflow-hidden h-full flex flex-col transition-shadow hover:shadow-md">
        <div className="relative aspect-video bg-muted">
          {post.coverImageUrl && <Image src={post.coverImageUrl} alt={post.title} fill className="object-cover" />}
        </div>
        <CardContent className="p-4 flex flex-col gap-2 flex-1">
          <h3 className="font-semibold leading-snug line-clamp-2">{post.title}</h3>
          <p className="text-sm text-muted-foreground line-clamp-2">{post.excerpt}</p>
          <p className="mt-auto text-xs text-muted-foreground pt-2">
            {post.authorName}
            {post.publishedAt && ` • ${post.publishedAt.toLocaleDateString("vi-VN")}`}
          </p>
        </CardContent>
      </Card>
    </Link>
  );
}
