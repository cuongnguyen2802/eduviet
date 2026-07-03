import { getSiteSettings } from "@/lib/site-settings";
import { SettingsForm } from "@/components/admin/settings-form";

export default async function AdminSettingsPage() {
  const settings = await getSiteSettings();

  return (
    <div>
      <h1 className="text-2xl font-bold mb-1">Cài đặt chung</h1>
      <p className="text-sm text-muted-foreground mb-6">
        Quản lý logo, hotline trên header, mô tả và mạng xã hội ở footer, và chatbox Zalo/Messenger nổi trên toàn site.
      </p>
      <SettingsForm settings={settings} />
    </div>
  );
}
