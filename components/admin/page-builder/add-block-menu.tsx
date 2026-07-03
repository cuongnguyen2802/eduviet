"use client";

import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { BLOCK_LABELS, type BlockType } from "@/lib/blocks";

const TYPES = Object.keys(BLOCK_LABELS) as BlockType[];

export function AddBlockMenu({ onAdd }: { onAdd: (type: BlockType) => void }) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button type="button" variant="outline">
          <Plus className="mr-1.5 h-4 w-4" /> Thêm khối
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="start">
        {TYPES.map((type) => (
          <DropdownMenuItem key={type} onClick={() => onAdd(type)}>
            {BLOCK_LABELS[type]}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
