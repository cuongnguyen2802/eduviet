import { prisma } from "@/lib/prisma";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { NewMenuItemDialog } from "@/components/admin/new-menu-item-dialog";
import { EditMenuItemDialog } from "@/components/admin/edit-menu-item-dialog";
import { MenuItemRowActions } from "@/components/admin/menu-item-row-actions";

export default async function AdminMenuPage() {
  const items = await prisma.menuItem.findMany({ orderBy: { order: "asc" } });

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold">Menu chính</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Các link tĩnh hiển thị trên header cạnh mega menu danh mục (VD: &quot;Tất cả khóa học&quot;, &quot;Trở
            thành giảng viên&quot;).
          </p>
        </div>
        <NewMenuItemDialog />
      </div>

      <div className="space-y-2 max-w-xl">
        {items.map((item, index) => (
          <Card key={item.id}>
            <CardContent className="p-3 flex items-center justify-between gap-3">
              <div className="min-w-0">
                <div className="flex items-center gap-2">
                  <p className="font-medium truncate">{item.label}</p>
                  {!item.isActive && <Badge variant="outline">Đã ẩn</Badge>}
                </div>
                <p className="text-xs text-muted-foreground truncate">{item.url}</p>
              </div>
              <div className="flex items-center gap-1 shrink-0">
                <EditMenuItemDialog id={item.id} label={item.label} url={item.url} />
                <MenuItemRowActions
                  id={item.id}
                  isActive={item.isActive}
                  isFirst={index === 0}
                  isLast={index === items.length - 1}
                />
              </div>
            </CardContent>
          </Card>
        ))}
        {items.length === 0 && <p className="text-sm text-muted-foreground">Chưa có mục menu nào.</p>}
      </div>
    </div>
  );
}
