import { prisma } from "@/lib/prisma";

/** Chỉ danh mục con (leaf) mới được gán trực tiếp cho khóa học — danh mục cha chỉ dùng để nhóm trong mega menu. */
export async function getLeafCategories() {
  return prisma.category.findMany({
    where: { parentId: { not: null } },
    include: { parent: true },
    orderBy: [{ parent: { name: "asc" } }, { name: "asc" }],
  });
}
