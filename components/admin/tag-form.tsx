"use client";

import { useTransition } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { createTag } from "@/app/actions/admin";

export function TagForm() {
  const [isPending, startTransition] = useTransition();

  function handleSubmit(formData: FormData) {
    startTransition(async () => {
      const result = await createTag(formData);
      if (result?.error) toast.error(result.error);
    });
  }

  return (
    <form action={handleSubmit} className="flex gap-2 max-w-md">
      <Input name="name" placeholder="Tên tag mới" required />
      <Button type="submit" disabled={isPending}>
        Thêm
      </Button>
    </form>
  );
}
