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
  videoIntro: HTMLVideoElement;
  videoLoop: HTMLVideoElement;
  audio: HTMLAudioElement;
  bgm: HTMLAudioElement;
}

export interface MediaPlayState {
  isPlaying: boolean;
  autoplay: boolean;
  ended: boolean;
  canPlay: boolean;
  showContinueBtn: boolean;
  removeLoadingScreen: boolean;
}
