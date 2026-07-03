import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Pencil } from "lucide-react";
import { NewPageDialog } from "@/components/admin/new-page-dialog";
import { DeletePageButton } from "@/components/admin/delete-page-button";

export default async function AdminPagesPage() {
  const pages = await prisma.page.findMany({
    orderBy: [{ isSystemPage: "desc" }, { createdAt: "asc" }],
  });

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold">Quản lý trang</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Xây dựng trang chủ, Giới thiệu, Liên hệ và các trang tùy chỉnh khác bằng UX Builder kéo thả.
          </p>
        </div>
        <NewPageDialog />
      </div>

      <div className="space-y-2 max-w-2xl">
        {pages.map((page) => (
          <Card key={page.id}>
            <CardContent className="p-3 flex items-center justify-between gap-3">
              <div className="min-w-0">
                <div className="flex items-center gap-2">
                  <p className="font-medium truncate">{page.title}</p>
                  {page.isSystemPage && <Badge variant="outline">Hệ thống</Badge>}
                  <Badge variant={page.status === "PUBLISHED" ? "default" : "outline"}>
                    {page.status === "PUBLISHED" ? "Đã xuất bản" : "Bản nháp"}
                  </Badge>
                </div>
                <p className="text-xs text-muted-foreground truncate">
                  {page.slug === "trang-chu" ? "/ (chèn khối vào trang chủ)" : `/${page.slug}`}
                </p>
              </div>
              <div className="flex items-center gap-1 shrink-0">
                <Button variant="outline" size="sm" asChild>
                  <Link href={`/admin/pages/${page.id}/edit`}>
                    <Pencil className="mr-1.5 h-3.5 w-3.5" /> Sửa
                  </Link>
                </Button>
                {!page.isSystemPage && <DeletePageButton pageId={page.id} />}
              </div>
            </CardContent>
          </Card>
        ))}
        {pages.length === 0 && <p className="text-sm text-muted-foreground">Chưa có trang nào.</p>}
      </div>
    </div>
  );
}
