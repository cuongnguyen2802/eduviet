import { ResetPasswordForm } from "@/components/forms/reset-password-form";

export default function ResetPasswordPage() {
  return (
    <div className="space-y-6">
      <div className="text-center">
        <h1 className="text-2xl font-bold">Đặt lại mật khẩu</h1>
        <p className="text-sm text-muted-foreground mt-1">Nhập mật khẩu mới cho tài khoản của bạn</p>
      </div>

      <ResetPasswordForm />
    </div>
  );
}
