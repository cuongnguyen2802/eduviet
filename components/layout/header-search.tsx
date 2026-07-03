"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Search } from "lucide-react";

export function HeaderSearch() {
  const router = useRouter();
  const [value, setValue] = useState("");

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const params = new URLSearchParams();
    if (value.trim()) params.set("q", value.trim());
    router.push(`/courses?${params.toString()}`);
  }

  return (
    <form onSubmit={handleSubmit} className="relative hidden md:block flex-1 max-w-md">
      <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
      <input
        type="search"
        value={value}
        onChange={(e) => setValue(e.target.value)}
        placeholder="Tìm khóa học, giảng viên..."
        className="h-10 w-full rounded-full border bg-secondary/40 pl-9 pr-4 text-sm outline-none focus:border-primary focus:bg-background"
      />
    </form>
  );
}
