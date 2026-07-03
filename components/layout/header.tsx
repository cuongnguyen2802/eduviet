import Link from "next/link";
import { Phone } from "lucide-react";
import { getCurrentUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { getSiteSettings } from "@/lib/site-settings";
import { Button } from "@/components/ui/button";
import { CartButton } from "@/components/layout/cart-button";
import { UserMenu } from "@/components/layout/user-menu";
import { CategoryMegaMenu } from "@/components/layout/category-mega-menu";
import { HeaderSearch } from "@/components/layout/header-search";
import { SiteLogo } from "@/components/layout/site-logo";

export async function Header() {
  const [user, categories, menuItems, settings] = await Promise.all([
    getCurrentUser(),
    prisma.category.findMany({
      where: { parentId: null },
      include: { children: { orderBy: { name: "asc" } } },
      orderBy: { name: "asc" },
    }),
    prisma.menuItem.findMany({ where: { isActive: true }, orderBy: { order: "asc" } }),
    getSiteSettings(),
  ]);

  return (
    <header className="sticky top-0 z-40 border-b bg-background/95 backdrop-blur">
      <div className="container flex h-16 items-center justify-between gap-4">
        <SiteLogo logoUrl={settings.logoUrl} />

        <nav className="hidden md:flex items-center gap-2 text-sm font-medium shrink-0">
          <CategoryMegaMenu categories={categories} />
          {menuItems.map((item) => (
            <Link key={item.id} href={item.url} className="rounded-md px-3 py-2 hover:bg-accent">
              {item.label}
            </Link>
          ))}
        </nav>

        <HeaderSearch />

        <div className="flex items-center gap-2 shrink-0">
          {settings.hotlineEnabled && settings.hotlinePhone && (
            <a
              href={`tel:${settings.hotlinePhone.replace(/\s+/g, "")}`}
              className="hidden lg:flex items-center gap-1.5 text-sm font-semibold text-primary"
            >
              <Phone className="h-4 w-4" />
              {settings.hotlinePhone}
            </a>
          )}
          <CartButton />
          {user ? (
            <UserMenu name={user.name} role={user.role} avatarUrl={user.avatarUrl} />
          ) : (
            <>
              <Button variant="ghost" asChild>
                <Link href="/login">Đăng nhập</Link>
              </Button>
              <Button asChild>
                <Link href="/register">Đăng ký</Link>
              </Button>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
