import { prisma } from "@/lib/prisma";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { UserRoleSelect } from "@/components/admin/user-role-select";
import { BanToggleButton } from "@/components/admin/ban-toggle-button";
import { RevenueShareInput } from "@/components/admin/revenue-share-input";

export default async function AdminUsersPage() {
  const users = await prisma.user.findMany({ orderBy: { createdAt: "desc" } });

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Người dùng</h1>
      <div className="space-y-3">
        {users.map((u) => (
          <Card key={u.id}>
            <CardContent className="p-4 flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <Avatar>
                  {u.avatarUrl && <AvatarImage src={u.avatarUrl} alt={u.name} />}
                  <AvatarFallback>{u.name.slice(0, 2).toUpperCase()}</AvatarFallback>
                </Avatar>
                <div>
                  <div className="flex items-center gap-2">
                    <p className="font-medium">{u.name}</p>
                    {u.isBanned && <Badge variant="destructive">Đã khóa</Badge>}
                  </div>
                  <p className="text-sm text-muted-foreground">{u.email}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                {u.role === "INSTRUCTOR" && (
                  <RevenueShareInput userId={u.id} revenueSharePct={u.revenueSharePct} />
                )}
                <UserRoleSelect userId={u.id} role={u.role} />
                <BanToggleButton userId={u.id} isBanned={u.isBanned} />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
