import { prisma } from "@/lib/prisma";
import { Card, CardContent } from "@/components/ui/card";
import { TagForm } from "@/components/admin/tag-form";
import { DeleteTagButton } from "@/components/admin/delete-tag-button";

export default async function AdminTagsPage() {
  const tags = await prisma.tag.findMany({
    include: { _count: { select: { courses: true } } },
    orderBy: { name: "asc" },
  });

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Tag khóa học</h1>
      <TagForm />

      <div className="space-y-2 mt-6 max-w-md">
        {tags.map((t) => (
          <Card key={t.id}>
            <CardContent className="p-3 flex items-center justify-between">
              <div>
                <p className="font-medium">{t.name}</p>
                <p className="text-xs text-muted-foreground">{t._count.courses} khóa học</p>
              </div>
              <DeleteTagButton tagId={t.id} />
            </CardContent>
          </Card>
        ))}
        {tags.length === 0 && <p className="text-sm text-muted-foreground">Chưa có tag nào.</p>}
      </div>
    </div>
  );
}
