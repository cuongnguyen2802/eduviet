"use client";

import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { BLOCK_LABELS, type PageBlock } from "@/lib/blocks";
import { HeroForm } from "@/components/admin/page-builder/forms/hero-form";
import { RichTextForm } from "@/components/admin/page-builder/forms/richtext-form";
import { ImageTextForm } from "@/components/admin/page-builder/forms/image-text-form";
import { CtaForm } from "@/components/admin/page-builder/forms/cta-form";
import { FeaturesForm } from "@/components/admin/page-builder/forms/features-form";
import { SpacerForm } from "@/components/admin/page-builder/forms/spacer-form";

export function BlockEditDialog({
  block,
  open,
  onOpenChange,
  onChange,
}: {
  block: PageBlock | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onChange: (block: PageBlock) => void;
}) {
  if (!block) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[85vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{BLOCK_LABELS[block.type]}</DialogTitle>
        </DialogHeader>

        {block.type === "hero" && (
          <HeroForm props={block.props} onChange={(props) => onChange({ ...block, type: "hero", props })} />
        )}
        {block.type === "richtext" && (
          <RichTextForm props={block.props} onChange={(props) => onChange({ ...block, type: "richtext", props })} />
        )}
        {block.type === "imageText" && (
          <ImageTextForm props={block.props} onChange={(props) => onChange({ ...block, type: "imageText", props })} />
        )}
        {block.type === "cta" && (
          <CtaForm props={block.props} onChange={(props) => onChange({ ...block, type: "cta", props })} />
        )}
        {block.type === "features" && (
          <FeaturesForm props={block.props} onChange={(props) => onChange({ ...block, type: "features", props })} />
        )}
        {block.type === "spacer" && (
          <SpacerForm props={block.props} onChange={(props) => onChange({ ...block, type: "spacer", props })} />
        )}

        <Button type="button" onClick={() => onOpenChange(false)}>
          Xong
        </Button>
      </DialogContent>
    </Dialog>
  );
}
