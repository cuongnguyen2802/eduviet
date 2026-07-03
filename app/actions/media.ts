"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { requireRole } from "@/lib/auth";
import { createAdminClient } from "@/lib/supabase/admin";

export async function deleteMediaAsset(id: string) {
  await requireRole(["ADMIN"]);

  const asset = await prisma.mediaAsset.findUnique({ where: { id } });
  if (!asset) return;

  // URL công khai dạng .../storage/v1/object/public/<bucket>/<path> — tách ra để xóa file gốc trên Storage.
  const match = asset.url.match(/\/object\/public\/([^/]+)\/(.+)$/);
  if (match) {
    const [, bucket, path] = match;
    const admin = createAdminClient();
    await admin.storage.from(bucket).remove([path]);
  }

  await prisma.mediaAsset.delete({ where: { id } });
  revalidatePath("/admin/media");
}
