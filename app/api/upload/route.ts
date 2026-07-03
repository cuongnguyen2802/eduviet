import { NextResponse } from "next/server";
import { requireUser } from "@/lib/auth";
import { createAdminClient } from "@/lib/supabase/admin";
import { prisma } from "@/lib/prisma";

const ALLOWED_BUCKETS = ["course-covers", "avatars", "blog-covers", "media-library"] as const;
type Bucket = (typeof ALLOWED_BUCKETS)[number];

const ALLOWED_TYPES = ["image/png", "image/jpeg", "image/webp", "image/gif"];
const MAX_SIZE = 5 * 1024 * 1024; // 5MB

async function ensureBucket(bucket: Bucket) {
  const admin = createAdminClient();
  const { data: existing } = await admin.storage.getBucket(bucket);
  if (!existing) {
    await admin.storage.createBucket(bucket, { public: true, fileSizeLimit: MAX_SIZE });
  }
}

export async function POST(request: Request) {
  let user;
  try {
    user = await requireUser();
  } catch {
    return NextResponse.json({ error: "Vui lòng đăng nhập" }, { status: 401 });
  }

  const formData = await request.formData();
  const file = formData.get("file");
  const bucket = formData.get("bucket");

  if (!(file instanceof File)) {
    return NextResponse.json({ error: "Thiếu file" }, { status: 400 });
  }
  if (typeof bucket !== "string" || !ALLOWED_BUCKETS.includes(bucket as Bucket)) {
    return NextResponse.json({ error: "Bucket không hợp lệ" }, { status: 400 });
  }
  if (!ALLOWED_TYPES.includes(file.type)) {
    return NextResponse.json({ error: "Chỉ chấp nhận ảnh PNG, JPEG, WEBP, GIF" }, { status: 400 });
  }
  if (file.size > MAX_SIZE) {
    return NextResponse.json({ error: "Ảnh không được vượt quá 5MB" }, { status: 400 });
  }

  await ensureBucket(bucket as Bucket);

  const ext = file.name.split(".").pop() ?? "png";
  const path = `${user.id}/${crypto.randomUUID()}.${ext}`;

  const admin = createAdminClient();
  const buffer = Buffer.from(await file.arrayBuffer());

  const { error: uploadError } = await admin.storage
    .from(bucket)
    .upload(path, buffer, { contentType: file.type, upsert: false });

  if (uploadError) {
    return NextResponse.json({ error: "Tải ảnh lên thất bại" }, { status: 500 });
  }

  const { data } = admin.storage.from(bucket).getPublicUrl(path);

  const asset = await prisma.mediaAsset.create({
    data: {
      url: data.publicUrl,
      filename: file.name,
      mimeType: file.type,
      size: file.size,
      uploadedById: user.id,
    },
  });

  return NextResponse.json({ url: data.publicUrl, id: asset.id });
}
