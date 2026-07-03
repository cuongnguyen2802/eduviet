"use client";

import { Plus } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { BLOCK_LABELS, type BlockType } from "@/lib/blocks";

const TYPES = Object.keys(BLOCK_LABELS) as BlockType[];

/** Vạch mỏng giữa các khối — hover hiện nút "+" để chèn khối mới ngay tại vị trí đó, giống Flatsome. */
export function InsertBlockBar({ onAdd }: { onAdd: (type: BlockType) => void }) {
  return (
    <div className="group/insert relative z-10 flex h-3 items-center justify-center">
      <div className="absolute inset-x-0 top-1/2 h-px -translate-y-1/2 bg-transparent group-hover/insert:bg-primary/40" />
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <button
            type="button"
            className="relative flex h-6 w-6 scale-0 items-center justify-center rounded-full border bg-background text-muted-foreground opacity-0 shadow-sm transition-all hover:border-primary hover:text-primary group-hover/insert:scale-100 group-hover/insert:opacity-100"
            aria-label="Chèn khối"
          >
            <Plus className="h-3.5 w-3.5" />
          </button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="center">
          {TYPES.map((type) => (
            <DropdownMenuItem key={type} onClick={() => onAdd(type)}>
              {BLOCK_LABELS[type]}
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}
