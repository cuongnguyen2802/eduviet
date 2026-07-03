import Link from "next/link";
import { GraduationCap } from "lucide-react";

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen items-center justify-center bg-secondary/30 px-4">
      <div className="w-full max-w-md rounded-lg border bg-background p-8 shadow-sm">
        <Link href="/" className="flex items-center justify-center gap-2 font-bold text-xl mb-6">
          <GraduationCap className="h-6 w-6 text-primary" />
          EduViet
        </Link>
        {children}
      </div>
    </div>
  );
}
