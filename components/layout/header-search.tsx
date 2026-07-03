"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { Search, Loader2 } from "lucide-react";
import { formatVND } from "@/lib/format";

type CourseSuggestion = {
  slug: string;
  title: string;
  coverImageUrl: string | null;
  price: number;
  discountPrice: number | null;
  instructorName: string;
};

type CategorySuggestion = { slug: string; name: string };

export function HeaderSearch() {
  const router = useRouter();
  const containerRef = useRef<HTMLDivElement>(null);
  const [value, setValue] = useState("");
  const [open, setOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [courses, setCourses] = useState<CourseSuggestion[]>([]);
  const [categories, setCategories] = useState<CategorySuggestion[]>([]);
  const [activeIndex, setActiveIndex] = useState(-1);

  const items = [
    ...categories.map((c) => ({ type: "category" as const, href: `/courses?category=${c.slug}` })),
    ...courses.map((c) => ({ type: "course" as const, href: `/courses/${c.slug}` })),
    { type: "seeAll" as const, href: `/courses?q=${encodeURIComponent(value.trim())}` },
  ];

  useEffect(() => {
    const query = value.trim();
    if (query.length < 2) {
      setCourses([]);
      setCategories([]);
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    const timer = setTimeout(() => {
      fetch(`/api/search-suggestions?q=${encodeURIComponent(query)}`)
        .then((res) => res.json())
        .then((data) => {
          setCourses(data.courses ?? []);
          setCategories(data.categories ?? []);
        })
        .finally(() => setIsLoading(false));
    }, 300);

    return () => clearTimeout(timer);
  }, [value]);

  useEffect(() => {
    setActiveIndex(-1);
  }, [courses, categories]);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  function goToResults() {
    const params = new URLSearchParams();
    if (value.trim()) params.set("q", value.trim());
    router.push(`/courses?${params.toString()}`);
    setOpen(false);
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    goToResults();
  }

  function handleKeyDown(e: React.KeyboardEvent) {
    const hasSuggestions = value.trim().length >= 2;
    if (!hasSuggestions) return;

    if (e.key === "ArrowDown") {
      e.preventDefault();
      setActiveIndex((i) => Math.min(i + 1, items.length - 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setActiveIndex((i) => Math.max(i - 1, -1));
    } else if (e.key === "Enter" && activeIndex >= 0) {
      e.preventDefault();
      router.push(items[activeIndex].href);
      setOpen(false);
    } else if (e.key === "Escape") {
      setOpen(false);
    }
  }

  const showDropdown = open && value.trim().length >= 2;

  return (
    <div ref={containerRef} className="relative hidden md:block flex-1 max-w-md">
      <form onSubmit={handleSubmit}>
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <input
          type="search"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          onFocus={() => setOpen(true)}
          onKeyDown={handleKeyDown}
          placeholder="Tìm khóa học, giảng viên..."
          className="h-10 w-full rounded-full border bg-secondary/40 pl-9 pr-4 text-sm outline-none focus:border-primary focus:bg-background"
        />
      </form>

      {showDropdown && (
        <div className="absolute left-0 right-0 top-full z-50 mt-2 max-h-[70vh] overflow-y-auto rounded-lg border bg-background shadow-lg">
          {isLoading && courses.length === 0 && categories.length === 0 ? (
            <div className="flex items-center justify-center gap-2 py-8 text-sm text-muted-foreground">
              <Loader2 className="h-4 w-4 animate-spin" /> Đang tìm...
            </div>
          ) : (
            <>
              {categories.length > 0 && (
                <div className="border-b p-2">
                  <p className="px-2 py-1 text-xs font-semibold text-muted-foreground">Danh mục</p>
                  {categories.map((cat, i) => (
                    <Link
                      key={cat.slug}
                      href={`/courses?category=${cat.slug}`}
                      onClick={() => setOpen(false)}
                      className={`block rounded-md px-2 py-2 text-sm hover:bg-accent ${activeIndex === i ? "bg-accent" : ""}`}
                    >
                      {cat.name}
                    </Link>
                  ))}
                </div>
              )}

              {courses.length > 0 && (
                <div className="p-2">
                  <p className="px-2 py-1 text-xs font-semibold text-muted-foreground">Khóa học</p>
                  {courses.map((course, i) => {
                    const index = categories.length + i;
                    return (
                      <Link
                        key={course.slug}
                        href={`/courses/${course.slug}`}
                        onClick={() => setOpen(false)}
                        className={`flex items-center gap-3 rounded-md p-2 hover:bg-accent ${
                          activeIndex === index ? "bg-accent" : ""
                        }`}
                      >
                        <div className="relative h-12 w-16 shrink-0 overflow-hidden rounded bg-muted">
                          {course.coverImageUrl && (
                            <Image src={course.coverImageUrl} alt={course.title} fill className="object-cover" />
                          )}
                        </div>
                        <div className="min-w-0 flex-1">
                          <p className="truncate text-sm font-medium">{course.title}</p>
                          <p className="truncate text-xs text-muted-foreground">{course.instructorName}</p>
                        </div>
                        <p className="shrink-0 text-sm font-semibold">
                          {formatVND(course.discountPrice ?? course.price)}
                        </p>
                      </Link>
                    );
                  })}
                </div>
              )}

              {!isLoading && courses.length === 0 && categories.length === 0 && (
                <p className="px-4 py-6 text-center text-sm text-muted-foreground">
                  Không tìm thấy kết quả cho &quot;{value.trim()}&quot;
                </p>
              )}

              <button
                type="button"
                onClick={goToResults}
                className={`block w-full border-t px-4 py-3 text-left text-sm font-medium text-primary hover:bg-accent ${
                  activeIndex === items.length - 1 ? "bg-accent" : ""
                }`}
              >
                Xem tất cả kết quả cho &quot;{value.trim()}&quot;
              </button>
            </>
          )}
        </div>
      )}
    </div>
  );
}
