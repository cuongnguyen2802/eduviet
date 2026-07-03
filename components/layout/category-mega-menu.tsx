"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Grid2x2,
  ChevronRight,
  Briefcase,
  TrendingUp,
  Palette,
  Monitor,
  Languages,
  BookOpen,
  type LucideIcon,
} from "lucide-react";
import { cn } from "@/lib/utils";

const iconMap: Record<string, LucideIcon> = {
  Briefcase,
  TrendingUp,
  Palette,
  Monitor,
  Languages,
};

const CLOSE_DELAY_MS = 150;

export type MegaMenuCategory = {
  id: string;
  name: string;
  slug: string;
  icon: string | null;
  children: { id: string; name: string; slug: string }[];
};

export function CategoryMegaMenu({ categories }: { categories: MegaMenuCategory[] }) {
  const [open, setOpen] = useState(false);
  const [activeSlug, setActiveSlug] = useState(categories[0]?.slug ?? "");
  const containerRef = useRef<HTMLDivElement>(null);
  const closeTimer = useRef<ReturnType<typeof setTimeout>>();
  const pathname = usePathname();

  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    function handleEscape(e: KeyboardEvent) {
      if (e.key === "Escape") setOpen(false);
    }
    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("keydown", handleEscape);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleEscape);
    };
  }, []);

  useEffect(() => {
    return () => clearTimeout(closeTimer.current);
  }, []);

  function openNow() {
    clearTimeout(closeTimer.current);
    setOpen(true);
  }

  function closeSoon() {
    clearTimeout(closeTimer.current);
    closeTimer.current = setTimeout(() => setOpen(false), CLOSE_DELAY_MS);
  }

  const activeCategory = categories.find((c) => c.slug === activeSlug) ?? categories[0];

  if (categories.length === 0) return null;

  return (
    <div ref={containerRef} className="relative" onMouseEnter={openNow} onMouseLeave={closeSoon}>
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className={cn(
          "flex items-center gap-2 rounded-md px-3 py-2 text-sm font-medium hover:bg-accent",
          open && "bg-accent"
        )}
      >
        <Grid2x2 className="h-4 w-4" />
        Danh mục
      </button>

      {open && (
        <div className="absolute left-0 top-full z-50 flex w-[640px] overflow-hidden rounded-lg border bg-popover shadow-lg">
          <div className="w-64 shrink-0 border-r py-2">
            {categories.map((cat) => {
              const Icon = (cat.icon && iconMap[cat.icon]) || BookOpen;
              const active = cat.slug === activeSlug;
              return (
                <Link
                  key={cat.id}
                  href={`/courses?category=${cat.slug}`}
                  onMouseEnter={() => setActiveSlug(cat.slug)}
                  className={cn(
                    "flex items-center justify-between gap-2 px-4 py-2.5 text-sm hover:bg-accent",
                    active && "bg-accent font-medium text-primary"
                  )}
                >
                  <span className="flex items-center gap-2">
                    <Icon className="h-4 w-4" />
                    {cat.name}
                  </span>
                  <ChevronRight className="h-4 w-4 text-muted-foreground" />
                </Link>
              );
            })}
          </div>

          <div className="flex-1 p-5">
            {activeCategory && (
              <>
                <p className="text-xs font-semibold uppercase text-primary mb-3">{activeCategory.name}</p>
                <div className="grid grid-cols-2 gap-x-6 gap-y-2">
                  {activeCategory.children.map((child) => (
                    <Link
                      key={child.id}
                      href={`/courses?category=${child.slug}`}
                      className="text-sm text-muted-foreground hover:text-primary hover:underline py-1"
                    >
                      {child.name}
                    </Link>
                  ))}
                  {activeCategory.children.length === 0 && (
                    <p className="text-sm text-muted-foreground">Chưa có danh mục con.</p>
                  )}
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
