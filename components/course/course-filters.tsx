"use client";

import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Search } from "lucide-react";

type Category = { slug: string; name: string; children: { slug: string; name: string }[] };
type Instructor = { id: string; name: string };

export function CourseFilters({
  categories,
  instructors,
}: {
  categories: Category[];
  instructors: Instructor[];
}) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  function updateParam(key: string, value: string) {
    const params = new URLSearchParams(searchParams.toString());
    if (value && value !== "all") {
      params.set(key, value);
    } else {
      params.delete(key);
    }
    params.delete("page");
    router.push(`${pathname}?${params.toString()}`);
  }

  return (
    <div className="flex flex-col md:flex-row md:flex-wrap gap-3 mb-8">
      <div className="relative flex-1 min-w-[200px]">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Tìm kiếm khóa học..."
          defaultValue={searchParams.get("q") ?? ""}
          className="pl-9"
          onKeyDown={(e) => {
            if (e.key === "Enter") updateParam("q", (e.target as HTMLInputElement).value);
          }}
        />
      </div>

      <Select defaultValue={searchParams.get("category") ?? "all"} onValueChange={(v) => updateParam("category", v)}>
        <SelectTrigger className="w-full md:w-44">
          <SelectValue placeholder="Danh mục" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">Tất cả danh mục</SelectItem>
          {categories.map((c) => (
            <SelectGroup key={c.slug}>
              <SelectLabel>{c.name}</SelectLabel>
              <SelectItem value={c.slug}>Tất cả {c.name}</SelectItem>
              {c.children.map((child) => (
                <SelectItem key={child.slug} value={child.slug}>
                  {child.name}
                </SelectItem>
              ))}
            </SelectGroup>
          ))}
        </SelectContent>
      </Select>

      <Select defaultValue={searchParams.get("level") ?? "all"} onValueChange={(v) => updateParam("level", v)}>
        <SelectTrigger className="w-full md:w-40">
          <SelectValue placeholder="Cấp độ" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">Tất cả cấp độ</SelectItem>
          <SelectItem value="BEGINNER">Cơ bản</SelectItem>
          <SelectItem value="INTERMEDIATE">Trung cấp</SelectItem>
          <SelectItem value="ADVANCED">Nâng cao</SelectItem>
        </SelectContent>
      </Select>

      <Select defaultValue={searchParams.get("instructor") ?? "all"} onValueChange={(v) => updateParam("instructor", v)}>
        <SelectTrigger className="w-full md:w-44">
          <SelectValue placeholder="Giảng viên" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">Tất cả giảng viên</SelectItem>
          {instructors.map((i) => (
            <SelectItem key={i.id} value={i.id}>
              {i.name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <Select defaultValue={searchParams.get("rating") ?? "all"} onValueChange={(v) => updateParam("rating", v)}>
        <SelectTrigger className="w-full md:w-40">
          <SelectValue placeholder="Đánh giá" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">Mọi đánh giá</SelectItem>
          <SelectItem value="4">Từ 4 sao</SelectItem>
          <SelectItem value="3">Từ 3 sao</SelectItem>
          <SelectItem value="2">Từ 2 sao</SelectItem>
        </SelectContent>
      </Select>

      <Select defaultValue={searchParams.get("sort") ?? "newest"} onValueChange={(v) => updateParam("sort", v)}>
        <SelectTrigger className="w-full md:w-44">
          <SelectValue placeholder="Sắp xếp" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="newest">Mới nhất</SelectItem>
          <SelectItem value="price_asc">Giá tăng dần</SelectItem>
          <SelectItem value="price_desc">Giá giảm dần</SelectItem>
          <SelectItem value="rating_desc">Đánh giá cao nhất</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
}
