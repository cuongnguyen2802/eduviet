import { redirect } from "next/navigation";
import {
  LayoutDashboard,
  BookOpen,
  Users,
  Tag,
  Tags,
  Ticket,
  UserCheck,
  Wallet,
  Receipt,
  Menu,
  Newspaper,
  Images,
} from "lucide-react";
import { getCurrentUser } from "@/lib/auth";
import { Header } from "@/components/layout/header";
import { DashboardSidebar } from "@/components/dashboard/sidebar";

const links = [
  { href: "/admin", label: "Tổng quan", icon: <LayoutDashboard className="h-4 w-4" /> },
  { href: "/admin/courses", label: "Duyệt khóa học", icon: <BookOpen className="h-4 w-4" /> },
  { href: "/admin/orders", label: "Đơn hàng", icon: <Receipt className="h-4 w-4" /> },
  { href: "/admin/users", label: "Người dùng", icon: <Users className="h-4 w-4" /> },
  { href: "/admin/instructor-applications", label: "Đăng ký giảng viên", icon: <UserCheck className="h-4 w-4" /> },
  { href: "/admin/categories", label: "Danh mục", icon: <Tag className="h-4 w-4" /> },
  { href: "/admin/tags", label: "Tag khóa học", icon: <Tags className="h-4 w-4" /> },
  { href: "/admin/menu", label: "Menu chính", icon: <Menu className="h-4 w-4" /> },
  { href: "/admin/blog", label: "Blog", icon: <Newspaper className="h-4 w-4" /> },
  { href: "/admin/media", label: "Thư viện ảnh", icon: <Images className="h-4 w-4" /> },
  { href: "/admin/coupons", label: "Coupon", icon: <Ticket className="h-4 w-4" /> },
  { href: "/admin/withdrawals", label: "Duyệt rút tiền", icon: <Wallet className="h-4 w-4" /> },
];

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const user = await getCurrentUser();
  if (!user) redirect("/login");
  if (user.isBanned) redirect("/banned");
  if (user.role !== "ADMIN") redirect("/");

  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <div className="flex flex-1">
        <DashboardSidebar title="Quản trị" links={links} />
        <main className="flex-1 p-6">{children}</main>
      </div>
    </div>
  );
}
