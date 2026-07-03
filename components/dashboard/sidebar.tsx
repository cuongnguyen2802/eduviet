"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import type { ReactNode } from "react";

export type SidebarLink = { href: string; label: string; icon: ReactNode };

export function DashboardSidebar({ title, links }: { title: string; links: SidebarLink[] }) {
  const pathname = usePathname();

  return (
    <aside className="w-64 shrink-0 border-r min-h-[calc(100vh-4rem)] p-4">
      <p className="text-xs font-semibold uppercase text-muted-foreground px-3 mb-2">{title}</p>
      <nav className="space-y-1">
        {links.map((link) => {
          const active = pathname === link.href;
          return (
            <Link
              key={link.href}
              href={link.href}
              className={cn(
                "flex items-center gap-2 rounded-md px-3 py-2 text-sm font-medium transition-colors",
                active ? "bg-primary text-primary-foreground" : "hover:bg-accent"
              )}
            >
              {link.icon}
              {link.label}
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}
