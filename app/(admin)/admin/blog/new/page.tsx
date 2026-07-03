import { BlogPostForm } from "@/components/admin/blog-post-form";

export default function NewBlogPostPage() {
  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Viết bài mới</h1>
      <BlogPostForm />
    </div>
  );
}
