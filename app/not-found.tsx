import Link from "next/link";
import { FileQuestion } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-4 px-4 text-center">
      <FileQuestion className="h-12 w-12 text-muted-foreground" />
      <h1 className="text-2xl font-bold">Không tìm thấy trang</h1>
      <p className="text-muted-foreground max-w-md">
        Trang bạn tìm không tồn tại hoặc đã bị di chuyển.
      </p>
      <Button asChild>
        <Link href="/">Về trang chủ</Link>
      </Button>
    </div>
  );
}
