import { redirect } from "next/navigation";
import { BookOpen, Heart, User, Receipt } from "lucide-react";
import { getCurrentUser } from "@/lib/auth";
import { Header } from "@/components/layout/header";
import { DashboardSidebar } from "@/components/dashboard/sidebar";

const links = [
  { href: "/dashboard", label: "Khóa học của tôi", icon: <BookOpen className="h-4 w-4" /> },
  { href: "/dashboard/wishlist", label: "Yêu thích", icon: <Heart className="h-4 w-4" /> },
  { href: "/dashboard/orders", label: "Đơn hàng của tôi", icon: <Receipt className="h-4 w-4" /> },
  { href: "/dashboard/profile", label: "Hồ sơ", icon: <User className="h-4 w-4" /> },
];

export default async function StudentDashboardLayout({ children }: { children: React.ReactNode }) {
  const user = await getCurrentUser();
  if (!user) redirect("/login");
  if (user.isBanned) redirect("/banned");

  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <div className="flex flex-1">
        <DashboardSidebar title="Học viên" links={links} />
        <main className="flex-1 p-6">{children}</main>
      </div>
    </div>
  );
}
