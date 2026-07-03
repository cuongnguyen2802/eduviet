import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

const statusLabel: Record<string, { label: string; variant: "default" | "secondary" }> = {
  DRAFT: { label: "Bản nháp", variant: "secondary" },
  PUBLISHED: { label: "Đã xuất bản", variant: "default" },
};

export default async function AdminBlogPage() {
  const posts = await prisma.blogPost.findMany({
    include: { author: true },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Blog</h1>
        <Button asChild>
          <Link href="/admin/blog/new">Viết bài mới</Link>
        </Button>
      </div>

      <div className="space-y-3">
        {posts.map((post) => (
          <Link key={post.id} href={`/admin/blog/${post.id}/edit`}>
            <Card className="hover:border-primary transition-colors">
              <CardContent className="p-4 flex items-center justify-between">
                <div>
                  <p className="font-medium">{post.title}</p>
                  <p className="text-sm text-muted-foreground">
                    {post.author.name} • {post.createdAt.toLocaleDateString("vi-VN")}
                  </p>
                </div>
                <Badge variant={statusLabel[post.status].variant}>{statusLabel[post.status].label}</Badge>
              </CardContent>
            </Card>
          </Link>
        ))}
        {posts.length === 0 && (
          <p className="text-muted-foreground text-center py-12">Chưa có bài viết nào.</p>
        )}
      </div>
    </div>
  );
}
