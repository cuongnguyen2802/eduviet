"use client";

// Bản xem trước dùng riêng cho UX Builder (client component). Cố ý KHÔNG dùng chung
// components/page-builder/block-renderer.tsx vì nó import RichContent -> sanitize-html —
// một thư viện hướng server, nếu bundle vào client sẽ làm phình bundle admin/pages/[id]/edit
// hơn 90kB không cần thiết. Nội dung ở đây chỉ hiển thị cho chính admin đang soạn (đã tin cậy),
// còn trang công khai thực tế vẫn luôn sanitize qua BlockRenderer phía server.
import Image from "next/image";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { resolveFeatureIcon } from "@/lib/feature-icons";
import type { PageBlock } from "@/lib/blocks";

const SPACER_HEIGHT: Record<string, string> = {
  sm: "h-8",
  md: "h-16",
  lg: "h-28",
};

function RawHtml({ html, className }: { html: string; className?: string }) {
  return <div className={className} dangerouslySetInnerHTML={{ __html: html }} />;
}

export function BlockPreview({ block }: { block: PageBlock }) {
  switch (block.type) {
    case "hero": {
      const { title, subtitle, imageUrl, ctaLabel, variant } = block.props;
      const dark = variant === "dark";
      return (
        <section className={cn("relative overflow-hidden", dark ? "bg-slate-900 text-slate-100" : "bg-muted")}>
          {imageUrl && (
            <div className="absolute inset-0">
              <Image src={imageUrl} alt="" fill className="object-cover opacity-30" />
            </div>
          )}
          <div className="container relative py-16 text-center">
            <h2 className="text-3xl md:text-4xl font-bold">{title}</h2>
            {subtitle && (
              <p className={cn("mt-4 max-w-2xl mx-auto", dark ? "text-slate-300" : "text-muted-foreground")}>
                {subtitle}
              </p>
            )}
            {ctaLabel && (
              <Button size="lg" className="mt-6" tabIndex={-1}>
                {ctaLabel}
              </Button>
            )}
          </div>
        </section>
      );
    }

    case "richtext":
      return (
        <section className="container py-10">
          <RawHtml html={block.props.html} className="prose prose-sm sm:prose-base max-w-none mx-auto" />
        </section>
      );

    case "imageText": {
      const { imageUrl, imagePosition, title, html } = block.props;
      return (
        <section className="container py-10">
          <div className={cn("grid md:grid-cols-2 gap-8 items-center", imagePosition === "right" && "md:[&>*:first-child]:order-2")}>
            <div className="relative aspect-video rounded-lg overflow-hidden bg-muted">
              {imageUrl && <Image src={imageUrl} alt={title ?? ""} fill className="object-cover" />}
            </div>
            <div>
              {title && <h3 className="text-2xl font-bold mb-3">{title}</h3>}
              <RawHtml html={html} className="prose prose-sm sm:prose-base max-w-none" />
            </div>
          </div>
        </section>
      );
    }

    case "cta": {
      const { title, subtitle, buttonLabel, style } = block.props;
      const dark = style === "dark";
      return (
        <section className={cn("py-14", dark ? "bg-slate-900 text-slate-100" : "bg-primary/5")}>
          <div className="container text-center">
            <h3 className="text-2xl md:text-3xl font-bold">{title}</h3>
            {subtitle && <p className={cn("mt-3", dark ? "text-slate-300" : "text-muted-foreground")}>{subtitle}</p>}
            {buttonLabel && (
              <Button size="lg" className="mt-6" variant={dark ? "secondary" : "default"} tabIndex={-1}>
                {buttonLabel}
              </Button>
            )}
          </div>
        </section>
      );
    }

    case "features":
      return (
        <section className="container py-10">
          {block.props.title && <h3 className="text-2xl font-bold text-center mb-8">{block.props.title}</h3>}
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {block.props.items.map((item, i) => {
              const Icon = resolveFeatureIcon(item.icon);
              return (
                <div key={i} className="rounded-lg border p-5 text-center">
                  <Icon className="h-8 w-8 text-primary mx-auto" />
                  <p className="font-semibold mt-3">{item.title}</p>
                  <p className="text-sm text-muted-foreground mt-1">{item.description}</p>
                </div>
              );
            })}
          </div>
        </section>
      );

    case "spacer":
      return (
        <div className={cn(SPACER_HEIGHT[block.props.height], "flex items-center justify-center text-xs text-muted-foreground")}>
          (khoảng trống)
        </div>
      );

    default:
      return null;
  }
}
