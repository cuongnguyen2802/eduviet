"use client";

import { useTransition } from "react";
import { toast } from "sonner";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { updateUserRole } from "@/app/actions/admin";
import type { Role } from "@prisma/client";

export function UserRoleSelect({ userId, role }: { userId: string; role: Role }) {
  const [isPending, startTransition] = useTransition();

  return (
    <Select
      value={role}
      disabled={isPending}
      onValueChange={(v) =>
        startTransition(async () => {
          const result = await updateUserRole(userId, v as Role);
          if (result?.error) toast.error(result.error);
          else toast.success("Đã cập nhật vai trò người dùng");
        })
      }
    >
      <SelectTrigger className="w-40">
        <SelectValue />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="STUDENT">Học viên</SelectItem>
        <SelectItem value="INSTRUCTOR">Giảng viên</SelectItem>
        <SelectItem value="ADMIN">Admin</SelectItem>
      </SelectContent>
    </Select>
  );
}
