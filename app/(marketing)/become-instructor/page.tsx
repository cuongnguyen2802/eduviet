import Link from "next/link";
import { getCurrentUser } from "@/lib/auth";
import { InstructorApplicationForm } from "@/components/forms/instructor-application-form";
import { Button } from "@/components/ui/button";

export default async function BecomeInstructorPage() {
  const user = await getCurrentUser();

  return (
    <div className="container py-14 max-w-2xl">
      <h1 className="text-3xl font-bold mb-2">Trở thành giảng viên</h1>
      <p className="text-muted-foreground mb-8">
        Chia sẻ kiến thức của bạn với hàng nghìn học viên trên khắp Việt Nam. Đăng ký để admin xét duyệt.
      </p>

      {user ? (
        <InstructorApplicationForm />
      ) : (
        <div className="rounded-lg border p-6 text-center">
          <p className="mb-4">Vui lòng đăng nhập để đăng ký làm giảng viên.</p>
          <Button asChild>
            <Link href="/login">Đăng nhập</Link>
          </Button>
        </div>
      )}
    </div>
  );
}
