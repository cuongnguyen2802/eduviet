"use client";

import { useEffect } from "react";
import Link from "next/link";
import { AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function ErrorBoundary({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-4 px-4 text-center">
      <AlertTriangle className="h-12 w-12 text-destructive" />
      <h1 className="text-2xl font-bold">Đã có lỗi xảy ra</h1>
      <p className="text-muted-foreground max-w-md">
        Rất tiếc, đã có lỗi ngoài dự kiến. Bạn có thể thử lại hoặc quay về trang chủ.
      </p>
      <div className="flex gap-3">
        <Button onClick={reset}>Thử lại</Button>
        <Button variant="outline" asChild>
          <Link href="/">Về trang chủ</Link>
        </Button>
      </div>
    </div>
  );
}
