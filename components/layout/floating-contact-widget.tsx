"use client";

import { Phone, MessageCircle } from "lucide-react";
import { cn } from "@/lib/utils";

type Props = {
  hotlineEnabled: boolean;
  hotlinePhone: string | null;
  chatWidgetEnabled: boolean;
  zaloChatUrl: string | null;
  messengerChatUrl: string | null;
};

export function FloatingContactWidget({
  hotlineEnabled,
  hotlinePhone,
  chatWidgetEnabled,
  zaloChatUrl,
  messengerChatUrl,
}: Props) {
  const showHotline = hotlineEnabled && hotlinePhone;
  const showZalo = chatWidgetEnabled && zaloChatUrl;
  const showMessenger = chatWidgetEnabled && messengerChatUrl;

  if (!showHotline && !showZalo && !showMessenger) return null;

  return (
    <div className="fixed bottom-5 right-5 z-50 flex flex-col items-center gap-3">
      {showMessenger && (
        <a
          href={messengerChatUrl}
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Chat qua Messenger"
          title="Chat qua Messenger"
          className="flex h-12 w-12 items-center justify-center rounded-full bg-[#0084FF] text-white shadow-lg transition-transform hover:scale-105"
        >
          <MessageCircle className="h-6 w-6" />
        </a>
      )}
      {showZalo && (
        <a
          href={zaloChatUrl}
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Chat qua Zalo"
          title="Chat qua Zalo"
          className="flex h-12 w-12 items-center justify-center rounded-full bg-[#0068FF] text-xs font-bold text-white shadow-lg transition-transform hover:scale-105"
        >
          Zalo
        </a>
      )}
      {showHotline && (
        <a
          href={`tel:${hotlinePhone!.replace(/\s+/g, "")}`}
          aria-label={`Gọi hotline ${hotlinePhone}`}
          title={`Gọi hotline ${hotlinePhone}`}
          className={cn(
            "relative flex h-12 w-12 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-lg transition-transform hover:scale-105"
          )}
        >
          <span className="absolute inset-0 animate-ping rounded-full bg-primary/60" />
          <Phone className="relative h-5 w-5" />
        </a>
      )}
    </div>
  );
}
