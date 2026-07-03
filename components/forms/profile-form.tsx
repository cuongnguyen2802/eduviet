"use client";

import { useTransition } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { ImageUpload } from "@/components/forms/image-upload";
import { updateProfile } from "@/app/actions/profile";

export function ProfileForm({
  name,
  email,
  bio,
  avatarUrl,
}: {
  name: string;
  email: string;
  bio: string | null;
  avatarUrl: string | null;
}) {
  const [isPending, startTransition] = useTransition();

  function handleSubmit(formData: FormData) {
    startTransition(async () => {
      const result = await updateProfile(formData);
      if (result?.error) toast.error(result.error);
      else toast.success("Đã cập nhật hồ sơ");
    });
  }

  return (
    <form action={handleSubmit} className="space-y-4 max-w-lg">
      <div className="space-y-2">
        <Label>Ảnh đại diện</Label>
        <ImageUpload bucket="avatars" name="avatarUrl" defaultValue={avatarUrl} aspect="aspect-square" />
      </div>
      <div className="space-y-2">
        <Label htmlFor="email">Email</Label>
        <Input id="email" defaultValue={email} disabled />
      </div>
      <div className="space-y-2">
        <Label htmlFor="name">Họ và tên</Label>
        <Input id="name" name="name" defaultValue={name} required />
      </div>
      <div className="space-y-2">
        <Label htmlFor="bio">Giới thiệu</Label>
        <Textarea id="bio" name="bio" defaultValue={bio ?? ""} />
      </div>
      <Button type="submit" disabled={isPending}>
        {isPending ? "Đang lưu..." : "Lưu thay đổi"}
      </Button>
    </form>
  );
}
