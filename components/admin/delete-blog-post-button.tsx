"use client";

import { useTransition } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { deleteBlogPost } from "@/app/actions/blog";

export function DeleteBlogPostButton({ postId }: { postId: string }) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  return (
    <Button
      variant="destructive"
      size="sm"
      disabled={isPending}
      onClick={() =>
        startTransition(async () => {
          await deleteBlogPost(postId);
          toast.success("Đã xóa bài viết");
          router.push("/admin/blog");
        })
      }
    >
      <Trash2 className="mr-1 h-4 w-4" /> Xóa bài viết
    </Button>
  );
}
