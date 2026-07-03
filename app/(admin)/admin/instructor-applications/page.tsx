import { prisma } from "@/lib/prisma";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ApplicationActions } from "@/components/admin/application-actions";

const statusLabel: Record<string, { label: string; variant: "default" | "secondary" | "destructive" }> = {
  PENDING: { label: "Chờ duyệt", variant: "secondary" },
  APPROVED: { label: "Đã duyệt", variant: "default" },
  REJECTED: { label: "Đã từ chối", variant: "destructive" },
};

export default async function InstructorApplicationsPage() {
  const applications = await prisma.instructorApplication.findMany({
    include: { user: true },
    orderBy: { submittedAt: "desc" },
  });

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Đăng ký làm giảng viên</h1>
      <div className="space-y-3">
        {applications.map((app) => (
          <Card key={app.id}>
            <CardContent className="p-4">
              <div className="flex items-center justify-between mb-2">
                <div>
                  <p className="font-medium">{app.user.name}</p>
                  <p className="text-sm text-muted-foreground">{app.user.email}</p>
                </div>
                <Badge variant={statusLabel[app.status].variant}>{statusLabel[app.status].label}</Badge>
              </div>
              <p className="text-sm font-medium">{app.headline}</p>
              <p className="text-sm text-muted-foreground mt-1">{app.expertise}</p>
              {app.status === "PENDING" && (
                <div className="mt-3">
                  <ApplicationActions applicationId={app.id} />
                </div>
              )}
            </CardContent>
          </Card>
        ))}
        {applications.length === 0 && (
          <p className="text-muted-foreground text-center py-12">Chưa có đăng ký nào.</p>
        )}
      </div>
    </div>
  );
}
