"use client";

import { useState, useTransition } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { submitInstructorApplication } from "@/app/actions/instructor";

export function InstructorApplicationForm() {
  const [isPending, startTransition] = useTransition();
  const [submitted, setSubmitted] = useState(false);

  function handleSubmit(formData: FormData) {
    startTransition(async () => {
      const result = await submitInstructorApplication(formData);
      if (result?.error) {
        toast.error(result.error);
      } else {
        setSubmitted(true);
        toast.success("Đã gửi đăng ký! Admin sẽ xét duyệt trong thời gian sớm nhất.");
      }
    });
  }

  if (submitted) {
    return (
      <p className="rounded-lg border bg-secondary/40 p-6 text-center">
        Cảm ơn bạn đã đăng ký làm giảng viên. Chúng tôi sẽ xét duyệt và phản hồi qua email.
      </p>
    );
  }

  return (
    <form action={handleSubmit} className="space-y-4 max-w-lg">
      <div className="space-y-2">
        <Label htmlFor="headline">Tiêu đề giới thiệu</Label>
        <Input id="headline" name="headline" placeholder="VD: Chuyên gia Marketing 10 năm kinh nghiệm" required />
      </div>
      <div className="space-y-2">
        <Label htmlFor="expertise">Chuyên môn của bạn</Label>
        <Textarea id="expertise" name="expertise" placeholder="Mô tả kinh nghiệm, lĩnh vực bạn muốn giảng dạy..." required />
      </div>
      <Button type="submit" disabled={isPending}>
        {isPending ? "Đang gửi..." : "Gửi đăng ký"}
      </Button>
    </form>
  );
}
