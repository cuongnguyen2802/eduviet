"use client";

import { useTransition } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { deletePage } from "@/app/actions/pages";

export function DeletePageButton({ pageId }: { pageId: string }) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  return (
    <Button
      variant="ghost"
      size="icon"
      title="Xóa trang"
      disabled={isPending}
      onClick={() =>
        startTransition(async () => {
          const result = await deletePage(pageId);
          if (result?.error) {
            toast.error(result.error);
            return;
          }
          toast.success("Đã xóa trang");
          router.refresh();
        })
      }
    >
      <Trash2 className="h-4 w-4 text-destructive" />
    </Button>
  );
}
