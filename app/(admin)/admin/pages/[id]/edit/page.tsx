import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { PageBuilder } from "@/components/admin/page-builder/page-builder";
import type { PageBlock } from "@/lib/blocks";

export default async function AdminPageEditPage({ params }: { params: { id: string } }) {
  const page = await prisma.page.findUnique({ where: { id: params.id } });
  if (!page) notFound();

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Xây dựng trang: {page.title}</h1>
      <PageBuilder
        page={{
          id: page.id,
          title: page.title,
          slug: page.slug,
          status: page.status,
          isSystemPage: page.isSystemPage,
          metaTitle: page.metaTitle,
          metaDescription: page.metaDescription,
          blocks: page.blocks as unknown as PageBlock[],
        }}
      />
    </div>
  );
}
