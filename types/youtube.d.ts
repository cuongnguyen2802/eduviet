declare namespace YT {
  class Player {
    constructor(element: HTMLElement | string, options: PlayerOptions);
    getCurrentTime(): number;
    setPlaybackRate(suggestedRate: number): void;
    getPlaybackRate(): number;
    getAvailablePlaybackRates(): number[];
    destroy(): void;
  }

  interface PlayerOptions {
    videoId: string;
    playerVars?: Record<string, number | string>;
    events?: {
      onReady?: (event: PlayerEvent) => void;
      onStateChange?: (event: OnStateChangeEvent) => void;
    };
  }

  interface PlayerEvent {
    target: Player;
  }

  interface OnStateChangeEvent {
    target: Player;
    data: number;
  }

  const PlayerState: {
    UNSTARTED: -1;
    ENDED: 0;
    PLAYING: 1;
    PAUSED: 2;
    BUFFERING: 3;
    CUED: 5;
  };
}
