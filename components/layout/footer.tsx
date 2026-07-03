import Link from "next/link";
import { GraduationCap, Facebook, Youtube, Instagram } from "lucide-react";
import { prisma } from "@/lib/prisma";

async function getCategoryTree() {
  return prisma.category.findMany({
    where: { parentId: null },
    include: { children: { orderBy: { name: "asc" } } },
    orderBy: { name: "asc" },
  });
}

export async function Footer() {
  const categories = await getCategoryTree();

  return (
    <footer className="border-t">
      {categories.length > 0 && (
        <div className="bg-slate-900 py-12 text-slate-200">
          <div className="container">
            <h2 className="mb-8 text-lg font-semibold">Khám phá khóa học theo danh mục</h2>
            <div className="grid grid-cols-2 gap-x-6 gap-y-8 sm:grid-cols-3 lg:grid-cols-5">
              {categories.map((cat) => (
                <div key={cat.id}>
                  <p className="mb-3 font-semibold text-white">{cat.name}</p>
                  <ul className="space-y-2 text-sm text-slate-400">
                    {cat.children.map((child) => (
                      <li key={child.id}>
                        <Link href={`/courses?category=${child.slug}`} className="hover:text-primary hover:underline">
                          {child.name}
                        </Link>
                      </li>
                    ))}
                    <li>
                      <Link href={`/courses?category=${cat.slug}`} className="text-primary hover:underline">
                        Xem tất cả
                      </Link>
                    </li>
                  </ul>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      <div className="bg-secondary/40">
        <div className="container grid gap-8 py-12 md:grid-cols-5">
          <div className="md:col-span-2">
            <Link href="/" className="flex items-center gap-2 font-bold text-lg">
              <GraduationCap className="h-6 w-6 text-primary" />
              EduViet
            </Link>
            <p className="mt-3 max-w-xs text-sm text-muted-foreground">
              Nền tảng học trực tuyến hàng đầu Việt Nam — mua trọn đời, học theo tốc độ của riêng bạn.
            </p>
            <div className="mt-4 flex gap-3 text-muted-foreground">
              <Link href="#" aria-label="Facebook" className="hover:text-primary">
                <Facebook className="h-5 w-5" />
              </Link>
              <Link href="#" aria-label="Youtube" className="hover:text-primary">
                <Youtube className="h-5 w-5" />
              </Link>
              <Link href="#" aria-label="Instagram" className="hover:text-primary">
                <Instagram className="h-5 w-5" />
              </Link>
            </div>
          </div>

          <div>
            <p className="font-semibold mb-3">Học viên</p>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><Link href="/courses" className="hover:text-primary">Tất cả khóa học</Link></li>
              <li><Link href="/dashboard" className="hover:text-primary">Khóa học của tôi</Link></li>
              <li><Link href="/dashboard/wishlist" className="hover:text-primary">Yêu thích</Link></li>
              <li><Link href="/dashboard/orders" className="hover:text-primary">Đơn hàng của tôi</Link></li>
            </ul>
          </div>

          <div>
            <p className="font-semibold mb-3">Giảng viên</p>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><Link href="/become-instructor" className="hover:text-primary">Trở thành giảng viên</Link></li>
              <li><Link href="/instructor/dashboard" className="hover:text-primary">Kênh giảng viên</Link></li>
              <li><Link href="/instructor/revenue" className="hover:text-primary">Doanh thu & rút tiền</Link></li>
            </ul>
          </div>

          <div>
            <p className="font-semibold mb-3">Công ty</p>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>Về chúng tôi</li>
              <li>Liên hệ</li>
              <li>Điều khoản sử dụng</li>
              <li>Chính sách bảo mật</li>
            </ul>
          </div>
        </div>
      </div>

      <div className="border-t py-4">
        <div className="container flex flex-col items-center justify-between gap-2 text-xs text-muted-foreground sm:flex-row">
          <p>© {new Date().getFullYear()} EduViet. All rights reserved.</p>
          <p>Made in Việt Nam</p>
        </div>
      </div>
    </footer>
  );
}
