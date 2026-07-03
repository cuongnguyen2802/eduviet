"use client";

import { useTransition } from "react";
import { Trash2 } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { deleteCategory } from "@/app/actions/admin";

export function DeleteCategoryButton({ categoryId }: { categoryId: string }) {
  const [isPending, startTransition] = useTransition();

  return (
    <Button
      variant="ghost"
      size="icon"
      disabled={isPending}
      onClick={() =>
        startTransition(async () => {
          try {
            await deleteCategory(categoryId);
          } catch {
            toast.error("Không thể xóa danh mục đang có khóa học hoặc danh mục con");
          }
        })
      }
    >
      <Trash2 className="h-4 w-4 text-destructive" />
    </Button>
  );
}
