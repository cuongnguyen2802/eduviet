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
            <SiteLogo logoUrl={settings.logoUrl} />
            <p className="mt-3 max-w-xs text-sm text-muted-foreground">{settings.footerDescription}</p>
            {(settings.socialFacebook || settings.socialYoutube || settings.socialZalo) && (
              <div className="mt-4 flex gap-3 text-muted-foreground">
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
              <li><Link href="/gioi-thieu" className="hover:text-primary">Về chúng tôi</Link></li>
              <li><Link href="/lien-he" className="hover:text-primary">Liên hệ</Link></li>
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
