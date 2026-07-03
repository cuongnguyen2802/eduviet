"use client";

import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { GripVertical, Pencil, Copy, Trash2 } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { BLOCK_LABELS, type PageBlock, type BlockSlot } from "@/lib/blocks";
import { BlockPreview } from "@/components/admin/page-builder/block-preview";
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
      className={cn("group/block relative", isDragging && "z-20 opacity-60 shadow-2xl")}
    >
      {/* Xem trước trực quan bằng chính component render công khai — vô hiệu tương tác để không điều hướng khi click. */}
      <div className="pointer-events-none select-none">
        <BlockPreview block={block} />
      </div>

      {/* Click bất kỳ đâu trên khối để sửa, giống UX Builder Flatsome. */}
      <button
        type="button"
        onClick={onEdit}
        aria-label={`Sửa ${BLOCK_LABELS[block.type]}`}
        className="absolute inset-0 cursor-pointer bg-primary/0 opacity-0 ring-inset ring-primary/60 transition-all group-hover/block:bg-primary/5 group-hover/block:opacity-100 group-hover/block:ring-2"
      />

      {/* Nhãn loại khối */}
      <div className="pointer-events-none absolute left-2 top-2 z-10 rounded bg-background/95 px-2 py-1 text-xs font-medium opacity-0 shadow-sm transition-opacity group-hover/block:opacity-100">
        {BLOCK_LABELS[block.type]}
      </div>

      {/* Tay cầm kéo thả */}
      <button
        type="button"
        {...attributes}
        {...listeners}
        aria-label="Kéo để sắp xếp"
        className="absolute right-2 top-2 z-10 flex h-7 w-7 cursor-grab items-center justify-center rounded border bg-background text-muted-foreground opacity-0 shadow-sm transition-opacity hover:text-foreground active:cursor-grabbing group-hover/block:opacity-100"
      >
        <GripVertical className="h-4 w-4" />
      </button>

      {/* Thanh công cụ: sửa / nhân bản / xóa (+ chọn vị trí trên trang chủ) */}
      <div className="absolute right-2 top-11 z-10 flex flex-col items-end gap-1 opacity-0 transition-opacity group-hover/block:opacity-100">
        {isHomepage && (
          <Select value={block.slot ?? "bottom"} onValueChange={(v) => onSlotChange(v as BlockSlot)}>
            <SelectTrigger className="h-7 w-36 border bg-background text-xs shadow-sm">
              <SelectValue />
            </SelectTrigger>
            <SelectContent onClick={(e) => e.stopPropagation()}>
              <SelectItem value="top">Đầu trang chủ</SelectItem>
              <SelectItem value="bottom">Cuối trang chủ</SelectItem>
            </SelectContent>
          </Select>
        )}
        <div className="flex items-center gap-1 rounded border bg-background p-0.5 shadow-sm">
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onEdit();
            }}
            title="Sửa"
            className="flex h-6 w-6 items-center justify-center rounded hover:bg-accent"
          >
            <Pencil className="h-3.5 w-3.5" />
          </button>
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onDuplicate();
            }}
            title="Nhân bản"
            className="flex h-6 w-6 items-center justify-center rounded hover:bg-accent"
          >
            <Copy className="h-3.5 w-3.5" />
          </button>
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onDelete();
            }}
            title="Xóa"
            className="flex h-6 w-6 items-center justify-center rounded hover:bg-accent"
          >
            <Trash2 className="h-3.5 w-3.5 text-destructive" />
          </button>
        </div>
      </div>
    </div>
  );
}
