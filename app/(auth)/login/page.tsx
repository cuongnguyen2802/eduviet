import Link from "next/link";
import { LoginForm } from "@/components/forms/login-form";
import { GoogleButton } from "@/components/forms/google-button";
import { Separator } from "@/components/ui/separator";

export default function LoginPage() {
  return (
    <div className="space-y-6">
      <div className="text-center">
        <h1 className="text-2xl font-bold">Đăng nhập</h1>
        <p className="text-sm text-muted-foreground mt-1">Chào mừng bạn quay trở lại</p>
      </div>

      <LoginForm />

      <p className="text-right text-sm">
        <Link href="/forgot-password" className="text-muted-foreground hover:text-primary hover:underline">
          Quên mật khẩu?
        </Link>
      </p>

      <div className="relative">
        <Separator />
        <span className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 bg-background px-2 text-xs text-muted-foreground">
          hoặc
        </span>
      </div>

      <GoogleButton />

      <p className="text-center text-sm text-muted-foreground">
        Chưa có tài khoản?{" "}
        <Link href="/register" className="text-primary font-medium hover:underline">
          Đăng ký ngay
        </Link>
      </p>
    </div>
  );
}
