"use client";

import { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";

declare global {
  interface Window {
    YT: typeof YT;
    onYouTubeIframeAPIReady: () => void;
  }
}

let apiLoadPromise: Promise<void> | null = null;

function loadYoutubeApi(): Promise<void> {
  if (apiLoadPromise) return apiLoadPromise;

  apiLoadPromise = new Promise((resolve) => {
    if (window.YT && window.YT.Player) {
      resolve();
      return;
    }
    const tag = document.createElement("script");
    tag.src = "https://www.youtube.com/iframe_api";
    document.head.appendChild(tag);
    window.onYouTubeIframeAPIReady = () => resolve();
  });

  return apiLoadPromise;
}

const SPEED_OPTIONS = [0.5, 0.75, 1, 1.25, 1.5, 2];

type VideoPlayerProps = {
  youtubeVideoId: string;
  startAtSec?: number;
  /** Gọi định kỳ (mỗi 5s) với vị trí hiện tại — dùng để lưu LessonProgress.lastPositionSec */
  onProgress?: (currentTimeSec: number) => void;
  /** Gọi khi video đã xem đến cuối — dùng để đánh dấu LessonProgress.completed */
  onEnded?: () => void;
};

/**
 * Nhúng video YouTube (Unlisted) qua IFrame Player API thay vì <iframe src=...> tĩnh,
 * để có thể bắt onStateChange/getCurrentTime() và tính tiến độ xem — theo quy tắc ở CLAUDE.md mục 7.
 */
export function VideoPlayer({ youtubeVideoId, startAtSec = 0, onProgress, onEnded }: VideoPlayerProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const playerRef = useRef<YT.Player | null>(null);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const [playbackRate, setPlaybackRate] = useState(1);
  const [playerReady, setPlayerReady] = useState(false);

  useEffect(() => {
    let cancelled = false;
    setPlayerReady(false);

    loadYoutubeApi().then(() => {
      if (cancelled || !containerRef.current) return;

      playerRef.current = new window.YT.Player(containerRef.current, {
        videoId: youtubeVideoId,
        playerVars: { start: Math.floor(startAtSec), rel: 0, modestbranding: 1 },
        events: {
          onReady: () => setPlayerReady(true),
          onStateChange: (event: YT.OnStateChangeEvent) => {
            if (event.data === window.YT.PlayerState.PLAYING) {
              intervalRef.current = setInterval(() => {
                const time = playerRef.current?.getCurrentTime();
                if (typeof time === "number") onProgress?.(Math.floor(time));
              }, 5000);
            } else if (intervalRef.current) {
              clearInterval(intervalRef.current);
            }

            if (event.data === window.YT.PlayerState.ENDED) {
              onEnded?.();
            }
          },
        },
      });
    });

    return () => {
      cancelled = true;
      if (intervalRef.current) clearInterval(intervalRef.current);
      playerRef.current?.destroy?.();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [youtubeVideoId]);

  function handleSpeedChange(rate: number) {
    setPlaybackRate(rate);
    playerRef.current?.setPlaybackRate(rate);
  }

  return (
    <div className="space-y-2">
      <div className="aspect-video w-full overflow-hidden rounded-lg bg-black">
        <div ref={containerRef} className="h-full w-full" />
      </div>
      <div className="flex items-center gap-1.5">
        <span className="text-xs text-muted-foreground mr-1">Tốc độ:</span>
        {SPEED_OPTIONS.map((rate) => (
          <button
            key={rate}
            type="button"
            disabled={!playerReady}
            onClick={() => handleSpeedChange(rate)}
            className={cn(
              "rounded px-2 py-0.5 text-xs font-medium transition-colors disabled:opacity-50",
              playbackRate === rate ? "bg-primary text-primary-foreground" : "bg-secondary hover:bg-secondary/80"
            )}
          >
            {rate}x
          </button>
        ))}
      </div>
    </div>
  );
}
