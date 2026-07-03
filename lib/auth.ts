import { cache } from "react";
import { createClient } from "@/lib/supabase/server";
import { prisma } from "@/lib/prisma";
import type { User } from "@prisma/client";

/**
 * Trả về user hiện tại (bảng User trong Prisma, đã bao gồm role) dựa trên
 * session Supabase Auth. `cache()` để tránh query lặp lại trong 1 request.
 *
 * Dùng getSession() (đọc cookie tại chỗ) thay vì getUser() (gọi mạng tới Supabase) vì
 * middleware.ts đã gọi getUser() để verify + refresh session cho MỌI request trước khi
 * Server Component này chạy — gọi lại getUser() ở đây chỉ tốn thêm 1 round-trip trùng lặp.
 */
export const getCurrentUser = cache(async (): Promise<User | null> => {
  const supabase = createClient();
  const {
    data: { session },
  } = await supabase.auth.getSession();

  if (!session?.user) return null;

  return prisma.user.findUnique({ where: { authId: session.user.id } });
});

export async function requireUser(): Promise<User> {
  const user = await getCurrentUser();
  if (!user) throw new Error("UNAUTHENTICATED");
  if (user.isBanned) throw new Error("BANNED");
  return user;
}

export async function requireRole(roles: User["role"][]): Promise<User> {
  const user = await requireUser();
  if (!roles.includes(user.role)) throw new Error("FORBIDDEN");
  return user;
}
