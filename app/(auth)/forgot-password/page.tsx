import Link from "next/link";
import { ForgotPasswordForm } from "@/components/forms/forgot-password-form";

export default function ForgotPasswordPage() {
  return (
    <div className="space-y-6">
      <div className="text-center">
        <h1 className="text-2xl font-bold">Quên mật khẩu</h1>
        <p className="text-sm text-muted-foreground mt-1">Nhập email để nhận link đặt lại mật khẩu</p>
      </div>

      <ForgotPasswordForm />

      <p className="text-center text-sm text-muted-foreground">
        <Link href="/login" className="text-primary font-medium hover:underline">
          Quay lại đăng nhập
        </Link>
      </p>
    </div>
  );
}
