import { prisma } from "@/lib/prisma";
import { Card, CardContent } from "@/components/ui/card";
import { CategoryForm } from "@/components/admin/category-form";
import { DeleteCategoryButton } from "@/components/admin/delete-category-button";
import { EditCategoryDialog } from "@/components/admin/edit-category-dialog";

export default async function AdminCategoriesPage() {
  const parents = await prisma.category.findMany({
    where: { parentId: null },
    include: {
      _count: { select: { courses: true } },
      children: { include: { _count: { select: { courses: true } } }, orderBy: { name: "asc" } },
    },
    orderBy: { name: "asc" },
  });

  const parentOptions = parents.map((p) => ({ id: p.id, name: p.name }));

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Danh mục</h1>
      <CategoryForm parents={parentOptions} />

      <div className="space-y-4 mt-6 max-w-xl">
        {parents.map((parent) => (
          <Card key={parent.id}>
            <CardContent className="p-3 space-y-2">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">{parent.name}</p>
                  <p className="text-xs text-muted-foreground">{parent._count.courses} khóa học trực tiếp</p>
                </div>
                <div className="flex items-center">
                  <EditCategoryDialog category={parent} parents={parentOptions} />
                  <DeleteCategoryButton categoryId={parent.id} />
                </div>
              </div>
              {parent.children.length > 0 && (
                <div className="ml-4 space-y-1 border-l pl-4">
                  {parent.children.map((child) => (
                    <div key={child.id} className="flex items-center justify-between">
                      <p className="text-sm">
                        {child.name} <span className="text-xs text-muted-foreground">({child._count.courses} khóa học)</span>
                      </p>
                      <div className="flex items-center">
                        <EditCategoryDialog category={child} parents={parentOptions} />
                        <DeleteCategoryButton categoryId={child.id} />
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        ))}
        {parents.length === 0 && <p className="text-sm text-muted-foreground">Chưa có danh mục nào.</p>}
      </div>
    </div>
  );
}
