import { cache } from "react";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { prisma } from "@/lib/prisma";
import { stripHtml } from "@/lib/sanitize";
import { BlockList } from "@/components/page-builder/block-renderer";
import type { PageBlock } from "@/lib/blocks";

// "trang-chu" là trang hệ thống đặc biệt, chỉ dùng để chèn khối vào "/" — không có route riêng.
const HOMEPAGE_SLUG = "trang-chu";

const getPage = cache(async (slug: string) => {
  if (slug === HOMEPAGE_SLUG) return null;
  return prisma.page.findUnique({ where: { slug, status: "PUBLISHED" } });
});

function firstBlockText(blocks: PageBlock[]): string {
  const withText = blocks.find((b) => b.type === "richtext" || b.type === "hero" || b.type === "cta");
  if (!withText) return "";
  if (withText.type === "richtext") return stripHtml(withText.props.html);
  return withText.props.subtitle ?? "";
}

export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  const page = await getPage(params.slug);
  if (!page) return { title: "Không tìm thấy trang — EduViet" };

  const blocks = page.blocks as unknown as PageBlock[];
  const description = page.metaDescription || firstBlockText(blocks).slice(0, 155);

  return {
    title: page.metaTitle || `${page.title} — EduViet`,
    description: description || undefined,
  };
}

export default async function CmsPage({ params }: { params: { slug: string } }) {
  const page = await getPage(params.slug);
  if (!page) notFound();

  const blocks = page.blocks as unknown as PageBlock[];

  return (
    <div>
      <BlockList blocks={blocks} />
    </div>
  );
}
