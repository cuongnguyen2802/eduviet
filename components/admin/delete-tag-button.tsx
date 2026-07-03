"use client";

import { useTransition } from "react";
import { Trash2 } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { deleteTag } from "@/app/actions/admin";

export function DeleteTagButton({ tagId }: { tagId: string }) {
  const [isPending, startTransition] = useTransition();

  return (
    <Button
      variant="ghost"
      size="icon"
      disabled={isPending}
      onClick={() =>
        startTransition(async () => {
          try {
            await deleteTag(tagId);
          } catch {
            toast.error("Không thể xóa tag");
          }
        })
      }
    >
      <Trash2 className="h-4 w-4 text-destructive" />
    </Button>
  );
}
