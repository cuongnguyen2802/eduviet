"use client";

import { useState, useTransition } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { ImagePickerField } from "@/components/admin/page-builder/image-picker-field";
import { updateSiteSettings, type SettingsInput } from "@/app/actions/settings";
import type { SiteSettingsData } from "@/lib/site-settings";

export function SettingsForm({ settings }: { settings: SiteSettingsData }) {
  const [logoUrl, setLogoUrl] = useState(settings.logoUrl ?? "");
  const [footerDescription, setFooterDescription] = useState(settings.footerDescription ?? "");
  const [socialFacebook, setSocialFacebook] = useState(settings.socialFacebook ?? "");
  const [socialYoutube, setSocialYoutube] = useState(settings.socialYoutube ?? "");
  const [socialZalo, setSocialZalo] = useState(settings.socialZalo ?? "");
  const [hotlineEnabled, setHotlineEnabled] = useState(settings.hotlineEnabled);
  const [hotlinePhone, setHotlinePhone] = useState(settings.hotlinePhone ?? "");
  const [chatWidgetEnabled, setChatWidgetEnabled] = useState(settings.chatWidgetEnabled);
  const [zaloChatUrl, setZaloChatUrl] = useState(settings.zaloChatUrl ?? "");
  const [messengerChatUrl, setMessengerChatUrl] = useState(settings.messengerChatUrl ?? "");
  const [isPending, startTransition] = useTransition();

  function handleSave() {
    const input: SettingsInput = {
      logoUrl,
      footerDescription,
      socialFacebook,
      socialYoutube,
      socialZalo,
      hotlineEnabled,
      hotlinePhone,
      chatWidgetEnabled,
      zaloChatUrl,
      messengerChatUrl,
    };
    startTransition(async () => {
      const result = await updateSiteSettings(input);
      if (result?.error) toast.error(result.error);
      else toast.success("Đã lưu cài đặt");
    });
  }

  return (
    <div className="space-y-6 max-w-2xl">
      <section className="rounded-lg border p-4 space-y-4">
        <h2 className="font-semibold">Header</h2>
        <ImagePickerField label="Logo (để trống dùng logo mặc định)" value={logoUrl} onChange={setLogoUrl} />
        <div className="flex items-center justify-between rounded-md border p-3">
          <div>
            <p className="text-sm font-medium">Hiện hotline trên header</p>
            <p className="text-xs text-muted-foreground">Hiển thị số điện thoại click-to-call cạnh giỏ hàng.</p>
          </div>
          <Switch checked={hotlineEnabled} onCheckedChange={setHotlineEnabled} />
        </div>
        <div className="space-y-2">
          <Label>Số hotline</Label>
          <Input value={hotlinePhone} onChange={(e) => setHotlinePhone(e.target.value)} placeholder="1900 1234" />
        </div>
      </section>

      <section className="rounded-lg border p-4 space-y-4">
        <h2 className="font-semibold">Footer</h2>
        <div className="space-y-2">
          <Label>Mô tả ngắn</Label>
          <Textarea
            value={footerDescription}
            onChange={(e) => setFooterDescription(e.target.value)}
            rows={2}
            maxLength={300}
          />
        </div>
        <div className="grid sm:grid-cols-3 gap-4">
          <div className="space-y-2">
            <Label>Facebook</Label>
            <Input value={socialFacebook} onChange={(e) => setSocialFacebook(e.target.value)} placeholder="https://facebook.com/..." />
          </div>
          <div className="space-y-2">
            <Label>Youtube</Label>
            <Input value={socialYoutube} onChange={(e) => setSocialYoutube(e.target.value)} placeholder="https://youtube.com/..." />
          </div>
          <div className="space-y-2">
            <Label>Zalo</Label>
            <Input value={socialZalo} onChange={(e) => setSocialZalo(e.target.value)} placeholder="https://zalo.me/..." />
          </div>
        </div>
      </section>

      <section className="rounded-lg border p-4 space-y-4">
        <h2 className="font-semibold">Chatbox nổi (Zalo / Messenger)</h2>
        <div className="flex items-center justify-between rounded-md border p-3">
          <div>
            <p className="text-sm font-medium">Bật nút chat nổi</p>
            <p className="text-xs text-muted-foreground">Hiện nút Zalo/Messenger nổi ở góc phải màn hình trên toàn site.</p>
          </div>
          <Switch checked={chatWidgetEnabled} onCheckedChange={setChatWidgetEnabled} />
        </div>
        <div className="grid sm:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label>Link chat Zalo</Label>
            <Input value={zaloChatUrl} onChange={(e) => setZaloChatUrl(e.target.value)} placeholder="https://zalo.me/1900xxxx" />
          </div>
          <div className="space-y-2">
            <Label>Link chat Messenger</Label>
            <Input value={messengerChatUrl} onChange={(e) => setMessengerChatUrl(e.target.value)} placeholder="https://m.me/eduviet" />
          </div>
        </div>
        <p className="text-xs text-muted-foreground">
          Nút gọi hotline nổi dùng chung số điện thoại đã cấu hình ở mục Header phía trên.
        </p>
      </section>

      <div className="sticky bottom-4 flex justify-end">
        <Button size="lg" onClick={handleSave} disabled={isPending} className="shadow-lg">
          {isPending ? "Đang lưu..." : "Lưu thay đổi"}
        </Button>
      </div>
    </div>
  );
}
