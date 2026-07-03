import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { BlogPostForm } from "@/components/admin/blog-post-form";
import { DeleteBlogPostButton } from "@/components/admin/delete-blog-post-button";

export default async function EditBlogPostPage({ params }: { params: { id: string } }) {
  const post = await prisma.blogPost.findUnique({ where: { id: params.id } });
  if (!post) notFound();

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Sửa bài viết</h1>
        <DeleteBlogPostButton postId={post.id} />
      </div>
      <BlogPostForm post={post} />
    </div>
  );
}
