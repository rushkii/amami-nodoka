export interface Asset {
  type: 'video-intro' | 'video-loop' | 'bgm';
  src: string;
  filename?: string;
}

export interface Progress {
  filename?: string;
  size?: number;
}

export interface MediaElementState {
  videoIntro: HTMLVideoElement | null;
  videoLoop: HTMLVideoElement | null;
  audio: HTMLAudioElement | null;
  bgm: HTMLAudioElement | null;
  loadingElement: HTMLDivElement | null;
}

export interface MediaPlayState {
  isPlaying: boolean;
  autoplay: boolean;
  ended: boolean;
  canPlay: boolean;
  showContinueBtn: boolean;
  removeLoadingScreen: boolean;
  allowPlay: boolean;
}
