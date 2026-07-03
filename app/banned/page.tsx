import { ShieldAlert } from "lucide-react";
import { SignOutButton } from "@/components/layout/sign-out-button";

export default function BannedPage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-4 px-4 text-center">
      <ShieldAlert className="h-12 w-12 text-destructive" />
      <h1 className="text-2xl font-bold">Tài khoản của bạn đã bị khóa</h1>
      <p className="text-muted-foreground max-w-md">
        Tài khoản này đã bị quản trị viên khóa và không thể tiếp tục sử dụng EduViet. Nếu bạn cho rằng đây là nhầm
        lẫn, vui lòng liên hệ bộ phận hỗ trợ.
      </p>
      <SignOutButton />
    </div>
  );
}
