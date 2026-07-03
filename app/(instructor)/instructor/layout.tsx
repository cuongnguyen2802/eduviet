import { redirect } from "next/navigation";
import { LayoutDashboard, BookOpen, MessageCircleQuestion, Wallet } from "lucide-react";
import { getCurrentUser } from "@/lib/auth";
import { Header } from "@/components/layout/header";
import { DashboardSidebar } from "@/components/dashboard/sidebar";

const links = [
  { href: "/instructor/dashboard", label: "Tổng quan", icon: <LayoutDashboard className="h-4 w-4" /> },
  { href: "/instructor/courses", label: "Khóa học", icon: <BookOpen className="h-4 w-4" /> },
  { href: "/instructor/questions", label: "Câu hỏi học viên", icon: <MessageCircleQuestion className="h-4 w-4" /> },
  { href: "/instructor/revenue", label: "Doanh thu", icon: <Wallet className="h-4 w-4" /> },
];

export default async function InstructorLayout({ children }: { children: React.ReactNode }) {
  const user = await getCurrentUser();
  if (!user) redirect("/login");
  if (user.isBanned) redirect("/banned");
  if (user.role === "STUDENT") redirect("/dashboard");

  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <div className="flex flex-1">
        <DashboardSidebar title="Kênh giảng viên" links={links} />
        <main className="flex-1 p-6">{children}</main>
      </div>
    </div>
  );
}
