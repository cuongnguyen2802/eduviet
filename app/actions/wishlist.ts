"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { requireUser } from "@/lib/auth";

export async function toggleWishlist(courseId: string) {
  const user = await requireUser();

  const existing = await prisma.wishlist.findUnique({
    where: { userId_courseId: { userId: user.id, courseId } },
  });

  if (existing) {
    await prisma.wishlist.delete({ where: { id: existing.id } });
  } else {
    await prisma.wishlist.create({ data: { userId: user.id, courseId } });
  }

  revalidatePath("/dashboard/wishlist");
  revalidatePath("/courses/[slug]", "page");
  return { wishlisted: !existing };
}
