"use client";

import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { GripVertical, Pencil, Copy, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { BLOCK_LABELS, blockSummary, type PageBlock, type BlockSlot } from "@/lib/blocks";
import { cn } from "@/lib/utils";

export function SortableBlockCard({
  block,
  isHomepage,
  onEdit,
  onDuplicate,
  onDelete,
  onSlotChange,
}: {
  block: PageBlock;
  isHomepage: boolean;
  onEdit: () => void;
  onDuplicate: () => void;
  onDelete: () => void;
  onSlotChange: (slot: BlockSlot) => void;
}) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: block.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={cn(
        "flex items-center gap-3 rounded-lg border bg-background p-3",
        isDragging && "opacity-50 shadow-lg"
      )}
    >
      <button
        type="button"
        className="cursor-grab touch-none text-muted-foreground hover:text-foreground active:cursor-grabbing"
        {...attributes}
        {...listeners}
      >
        <GripVertical className="h-5 w-5" />
      </button>

      <div className="min-w-0 flex-1">
        <p className="text-sm font-medium">{BLOCK_LABELS[block.type]}</p>
        <p className="text-xs text-muted-foreground truncate">{blockSummary(block)}</p>
      </div>

      {isHomepage && (
        <Select value={block.slot ?? "bottom"} onValueChange={(v) => onSlotChange(v as BlockSlot)}>
          <SelectTrigger className="w-36 shrink-0">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="top">Đầu trang chủ</SelectItem>
            <SelectItem value="bottom">Cuối trang chủ</SelectItem>
          </SelectContent>
        </Select>
      )}

      <div className="flex items-center gap-1 shrink-0">
        <Button type="button" variant="ghost" size="icon" onClick={onEdit} title="Sửa">
          <Pencil className="h-4 w-4" />
        </Button>
        <Button type="button" variant="ghost" size="icon" onClick={onDuplicate} title="Nhân bản">
          <Copy className="h-4 w-4" />
        </Button>
        <Button type="button" variant="ghost" size="icon" onClick={onDelete} title="Xóa">
          <Trash2 className="h-4 w-4 text-destructive" />
        </Button>
      </div>
    </div>
  );
}
