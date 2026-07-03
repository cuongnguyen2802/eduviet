"use client";

import { useState, useTransition } from "react";
import { toast } from "sonner";
import {
  DndContext,
  closestCenter,
  PointerSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
} from "@dnd-kit/core";
import { SortableContext, arrayMove, verticalListSortingStrategy } from "@dnd-kit/sortable";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { updatePageMeta, updatePageBlocks } from "@/app/actions/pages";
import { createDefaultBlock, type BlockSlot, type BlockType, type PageBlock } from "@/lib/blocks";
import { SortableBlockCard } from "@/components/admin/page-builder/sortable-block-card";
import { AddBlockMenu } from "@/components/admin/page-builder/add-block-menu";
import { InsertBlockBar } from "@/components/admin/page-builder/insert-block-bar";
import { BlockEditDialog } from "@/components/admin/page-builder/block-edit-dialog";

type PageData = {
  id: string;
  title: string;
  slug: string;
  status: "DRAFT" | "PUBLISHED";
  isSystemPage: boolean;
  metaTitle: string | null;
  metaDescription: string | null;
  blocks: PageBlock[];
};

export function PageBuilder({ page }: { page: PageData }) {
  const [title, setTitle] = useState(page.title);
  const [slug, setSlug] = useState(page.slug);
  const [status, setStatus] = useState(page.status);
  const [metaTitle, setMetaTitle] = useState(page.metaTitle ?? "");
  const [metaDescription, setMetaDescription] = useState(page.metaDescription ?? "");
  const [blocks, setBlocks] = useState<PageBlock[]>(page.blocks);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  const sensors = useSensors(useSensor(PointerSensor, { activationConstraint: { distance: 5 } }));
  const isHomepage = page.isSystemPage && page.slug === "trang-chu";
  const editingBlock = blocks.find((b) => b.id === editingId) ?? null;

  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event;
    if (!over || active.id === over.id) return;
    setBlocks((prev) => {
      const oldIndex = prev.findIndex((b) => b.id === active.id);
      const newIndex = prev.findIndex((b) => b.id === over.id);
      return arrayMove(prev, oldIndex, newIndex);
    });
  }

  function addBlockAt(index: number, type: BlockType) {
    const block = createDefaultBlock(type);
    setBlocks((prev) => {
      const next = [...prev];
      next.splice(index, 0, block);
      return next;
    });
    setEditingId(block.id);
  }

  function duplicateBlock(id: string) {
    setBlocks((prev) => {
      const index = prev.findIndex((b) => b.id === id);
      if (index === -1) return prev;
      const clone: PageBlock = { ...prev[index], id: Math.random().toString(36).slice(2, 10) };
      return [...prev.slice(0, index + 1), clone, ...prev.slice(index + 1)];
    });
  }

  function deleteBlock(id: string) {
    setBlocks((prev) => prev.filter((b) => b.id !== id));
  }

  function updateBlockSlot(id: string, slot: BlockSlot) {
    setBlocks((prev) => prev.map((b) => (b.id === id ? { ...b, slot } : b)));
  }

  function handleSave() {
    startTransition(async () => {
      const metaResult = await updatePageMeta(page.id, { title, slug, status, metaTitle, metaDescription });
      if (metaResult?.error) {
        toast.error(metaResult.error);
        return;
      }
      await updatePageBlocks(page.id, blocks);
      if (metaResult?.slug) setSlug(metaResult.slug);
      toast.success("Đã lưu trang");
    });
  }

  return (
    <div className="space-y-6">
      <div className="max-w-3xl rounded-lg border p-4 space-y-4">
        <div className="grid sm:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label>Tiêu đề trang</Label>
            <Input value={title} onChange={(e) => setTitle(e.target.value)} />
          </div>
          <div className="space-y-2">
            <Label>Slug {page.isSystemPage && "(trang hệ thống, không đổi được)"}</Label>
            <Input value={slug} onChange={(e) => setSlug(e.target.value)} disabled={page.isSystemPage} />
          </div>
        </div>
        <div className="grid sm:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label>Trạng thái</Label>
            <Select value={status} onValueChange={(v) => setStatus(v as "DRAFT" | "PUBLISHED")}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="DRAFT">Bản nháp</SelectItem>
                <SelectItem value="PUBLISHED">Xuất bản</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label>SEO title (tùy chọn)</Label>
            <Input value={metaTitle} onChange={(e) => setMetaTitle(e.target.value)} maxLength={70} />
          </div>
        </div>
        <div className="space-y-2">
          <Label>SEO description (tùy chọn)</Label>
          <Textarea value={metaDescription} onChange={(e) => setMetaDescription(e.target.value)} maxLength={160} rows={2} />
        </div>
      </div>

      <div className="flex items-center justify-between">
        <div>
          <h2 className="font-semibold">Xem trước trực quan</h2>
          <p className="text-xs text-muted-foreground mt-0.5">
            Di chuột vào khối để sửa/nhân bản/xóa/kéo sắp xếp. Rê chuột vào khoảng trống giữa các khối để chèn khối mới.
          </p>
        </div>
        <AddBlockMenu onAdd={(type) => addBlockAt(blocks.length, type)} />
      </div>

      {isHomepage && (
        <p className="text-xs text-muted-foreground -mt-4">
          Trang chủ giữ nguyên các phần động (hero slider, danh mục, khóa học nổi bật...) — không hiện ở đây. Chọn vị
          trí &quot;Đầu trang chủ&quot; hoặc &quot;Cuối trang chủ&quot; cho mỗi khối bạn thêm.
        </p>
      )}

      <div className="rounded-xl border bg-muted/30 p-3">
        <div className="rounded-lg border bg-background shadow-sm overflow-hidden">
          <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
            <SortableContext items={blocks.map((b) => b.id)} strategy={verticalListSortingStrategy}>
              <InsertBlockBar onAdd={(type) => addBlockAt(0, type)} />
              {blocks.map((block, index) => (
                <div key={block.id}>
                  <SortableBlockCard
                    block={block}
                    isHomepage={isHomepage}
                    onEdit={() => setEditingId(block.id)}
                    onDuplicate={() => duplicateBlock(block.id)}
                    onDelete={() => deleteBlock(block.id)}
                    onSlotChange={(slot) => updateBlockSlot(block.id, slot)}
                  />
                  <InsertBlockBar onAdd={(type) => addBlockAt(index + 1, type)} />
                </div>
              ))}
            </SortableContext>
          </DndContext>

          {blocks.length === 0 && (
            <p className="text-sm text-muted-foreground text-center py-12">
              Chưa có khối nội dung nào. Bấm &quot;Thêm khối&quot; hoặc di chuột vào vạch phía trên để bắt đầu.
            </p>
          )}
        </div>
      </div>

      <BlockEditDialog
        block={editingBlock}
        open={editingId !== null}
        onOpenChange={(open) => !open && setEditingId(null)}
        onChange={(updated) => setBlocks((prev) => prev.map((b) => (b.id === updated.id ? updated : b)))}
      />

      <div className="sticky bottom-4 flex justify-end">
        <Button size="lg" onClick={handleSave} disabled={isPending} className="shadow-lg">
          {isPending ? "Đang lưu..." : "Lưu thay đổi"}
        </Button>
      </div>
    </div>
  );
}
