"use client";

import { useTransition } from "react";
import { toast } from "sonner";
import { ChevronUp, ChevronDown, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { deleteMenuItem, moveMenuItem, toggleMenuItemActive } from "@/app/actions/menu";

export function MenuItemRowActions({
  id,
  isActive,
  isFirst,
  isLast,
}: {
  id: string;
  isActive: boolean;
  isFirst: boolean;
  isLast: boolean;
}) {
  const [isPending, startTransition] = useTransition();

  return (
    <div className="flex items-center gap-2">
      <Switch
        checked={isActive}
        disabled={isPending}
        onCheckedChange={(checked) =>
          startTransition(async () => {
            await toggleMenuItemActive(id, checked);
            toast.success(checked ? "Đã hiện mục menu" : "Đã ẩn mục menu");
          })
        }
      />
      <Button
        variant="ghost"
        size="icon"
        disabled={isPending || isFirst}
        onClick={() => startTransition(() => moveMenuItem(id, "up"))}
      >
        <ChevronUp className="h-4 w-4" />
      </Button>
      <Button
        variant="ghost"
        size="icon"
        disabled={isPending || isLast}
        onClick={() => startTransition(() => moveMenuItem(id, "down"))}
      >
        <ChevronDown className="h-4 w-4" />
      </Button>
      <Button
        variant="ghost"
        size="icon"
        disabled={isPending}
        onClick={() => startTransition(() => deleteMenuItem(id))}
      >
        <Trash2 className="h-4 w-4 text-destructive" />
      </Button>
    </div>
  );
}
