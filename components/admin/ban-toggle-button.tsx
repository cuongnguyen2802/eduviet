"use client";

import { useTransition } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { toggleUserBan } from "@/app/actions/admin";

export function BanToggleButton({ userId, isBanned }: { userId: string; isBanned: boolean }) {
  const [isPending, startTransition] = useTransition();

  return (
    <Button
      size="sm"
      variant={isBanned ? "secondary" : "destructive"}
      disabled={isPending}
      onClick={() =>
        startTransition(async () => {
          const result = await toggleUserBan(userId, !isBanned);
          if (result?.error) toast.error(result.error);
          else toast.success(isBanned ? "Đã mở khóa tài khoản" : "Đã khóa tài khoản");
        })
      }
    >
      {isBanned ? "Mở khóa" : "Khóa"}
    </Button>
  );
}
