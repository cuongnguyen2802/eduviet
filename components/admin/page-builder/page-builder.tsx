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

  function addBlock(type: BlockType) {
    const block = createDefaultBlock(type);
    setBlocks((prev) => [...prev, block]);
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
    <div className="space-y-6 max-w-3xl">
      <div className="rounded-lg border p-4 space-y-4">
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
        <h2 className="font-semibold">Các khối nội dung</h2>
        <AddBlockMenu onAdd={addBlock} />
      </div>

      {isHomepage && (
        <p className="text-xs text-muted-foreground -mt-4">
          Trang chủ giữ nguyên các phần động (hero slider, danh mục, khóa học nổi bật...). Chọn vị trí &quot;Đầu
          trang chủ&quot; hoặc &quot;Cuối trang chủ&quot; cho mỗi khối bạn thêm ở đây.
        </p>
      )}

      <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
        <SortableContext items={blocks.map((b) => b.id)} strategy={verticalListSortingStrategy}>
          <div className="space-y-2">
            {blocks.map((block) => (
              <SortableBlockCard
                key={block.id}
                block={block}
                isHomepage={isHomepage}
                onEdit={() => setEditingId(block.id)}
                onDuplicate={() => duplicateBlock(block.id)}
                onDelete={() => deleteBlock(block.id)}
                onSlotChange={(slot) => updateBlockSlot(block.id, slot)}
              />
            ))}
            {blocks.length === 0 && (
              <p className="text-sm text-muted-foreground text-center py-8 border rounded-lg border-dashed">
                Chưa có khối nội dung nào. Bấm &quot;Thêm khối&quot; để bắt đầu.
              </p>
            )}
          </div>
        </SortableContext>
      </DndContext>

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
