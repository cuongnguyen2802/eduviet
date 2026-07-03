import Link from "next/link";
import { RegisterForm } from "@/components/forms/register-form";
import { GoogleButton } from "@/components/forms/google-button";
import { Separator } from "@/components/ui/separator";

export default function RegisterPage() {
  return (
    <div className="space-y-6">
      <div className="text-center">
        <h1 className="text-2xl font-bold">Tạo tài khoản</h1>
        <p className="text-sm text-muted-foreground mt-1">Bắt đầu học ngay hôm nay</p>
      </div>

      <RegisterForm />

      <div className="relative">
        <Separator />
        <span className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 bg-background px-2 text-xs text-muted-foreground">
          hoặc
        </span>
      </div>

      <GoogleButton />

      <p className="text-center text-sm text-muted-foreground">
        Đã có tài khoản?{" "}
        <Link href="/login" className="text-primary font-medium hover:underline">
          Đăng nhập
        </Link>
      </p>
    </div>
  );
}
