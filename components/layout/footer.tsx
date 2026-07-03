import Link from "next/link";
import { Facebook, Youtube, MessageCircle } from "lucide-react";
import { prisma } from "@/lib/prisma";
import { getSiteSettings } from "@/lib/site-settings";
import { SiteLogo } from "@/components/layout/site-logo";

async function getCategoryTree() {
  return prisma.category.findMany({
    where: { parentId: null },
    include: { children: { orderBy: { name: "asc" } } },
    orderBy: { name: "asc" },
  });
}

export async function Footer() {
  const [categories, settings] = await Promise.all([getCategoryTree(), getSiteSettings()]);

  return (
    <footer className="border-t">
      {categories.length > 0 && (
        <div className="bg-slate-900 py-14 text-slate-200">
          <div className="container">
            <h2 className="mb-10 text-xl font-bold text-white">Khám phá kỹ năng &amp; khóa học nổi bật</h2>
            <div className="grid grid-cols-2 gap-x-8 gap-y-10 sm:grid-cols-3 lg:grid-cols-5">
              {categories.map((cat) => (
                <div key={cat.id}>
                  <p className="mb-4 font-semibold text-white">{cat.name}</p>
                  <ul className="space-y-2.5 text-sm text-indigo-300/90">
                    {cat.children.map((child) => (
                      <li key={child.id}>
                        <Link href={`/courses?category=${child.slug}`} className="hover:text-indigo-200 hover:underline">
                          {child.name}
                        </Link>
                      </li>
                    ))}
                    <li>
                      <Link href={`/courses?category=${cat.slug}`} className="font-medium text-white hover:underline">
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
        <div className="container grid grid-cols-2 gap-8 py-12 sm:grid-cols-4">
          <div>
            <p className="font-semibold mb-3">Học viên</p>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><Link href="/courses" className="hover:text-primary">Tất cả khóa học</Link></li>
              <li><Link href="/dashboard" className="hover:text-primary">Khóa học của tôi</Link></li>
              <li><Link href="/dashboard/wishlist" className="hover:text-primary">Yêu thích</Link></li>
              <li><Link href="/dashboard/orders" className="hover:text-primary">Đơn hàng của tôi</Link></li>
              <li><Link href="/blog" className="hover:text-primary">Blog</Link></li>
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
              <li><Link href="/gioi-thieu" className="hover:text-primary">Về chúng tôi</Link></li>
              <li><Link href="/lien-he" className="hover:text-primary">Liên hệ</Link></li>
            </ul>
          </div>

          <div>
            <p className="font-semibold mb-3">Pháp lý</p>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><Link href="/sitemap.xml" className="hover:text-primary">Sitemap</Link></li>
              <li className="text-muted-foreground/60">Điều khoản sử dụng</li>
              <li className="text-muted-foreground/60">Chính sách bảo mật</li>
            </ul>
          </div>
        </div>
      </div>

      <div className="border-t">
        <div className="container flex flex-col items-center gap-4 py-6 sm:flex-row sm:justify-between">
          <div className="flex flex-col items-center gap-3 sm:items-start">
            <SiteLogo logoUrl={settings.logoUrl} />
            <p className="max-w-xs text-center text-xs text-muted-foreground sm:text-left">
              {settings.footerDescription}
            </p>
          </div>

          <div className="flex flex-col items-center gap-3 sm:items-end">
            {(settings.socialFacebook || settings.socialYoutube || settings.socialZalo) && (
              <div className="flex gap-3 text-muted-foreground">
                {settings.socialFacebook && (
                  <Link href={settings.socialFacebook} target="_blank" aria-label="Facebook" className="hover:text-primary">
                    <Facebook className="h-5 w-5" />
                  </Link>
                )}
                {settings.socialYoutube && (
                  <Link href={settings.socialYoutube} target="_blank" aria-label="Youtube" className="hover:text-primary">
                    <Youtube className="h-5 w-5" />
                  </Link>
                )}
                {settings.socialZalo && (
                  <Link href={settings.socialZalo} target="_blank" aria-label="Zalo" className="hover:text-primary">
                    <MessageCircle className="h-5 w-5" />
                  </Link>
                )}
              </div>
            )}
            <div className="flex items-center gap-3 text-xs text-muted-foreground">
              <p>© {new Date().getFullYear()} EduViet. All rights reserved.</p>
              <span>•</span>
              <p>Made in Việt Nam</p>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
