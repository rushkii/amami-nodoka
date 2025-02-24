import type { MediaPlayState } from '$types';

const playStateManager = $state<MediaPlayState>({
  isPlaying: false,
  autoplay: false,
  ended: false,
  canPlay: false,
  showContinueBtn: false,
  removeLoadingScreen: false,
  allowPlay: false
});

export const usePlayStateManager = () => {
  return {
    get isPlaying() {
      return playStateManager.isPlaying;
    },
    get autoplay() {
      return playStateManager.autoplay;
    },
    get ended() {
      return playStateManager.ended;
    },
    get canPlay() {
      return playStateManager.canPlay;
    },
    get showContinueBtn() {
      return playStateManager.showContinueBtn;
    },
    get removeLoadingScreen() {
      return playStateManager.removeLoadingScreen;
    },
    get allowPlay() {
      return playStateManager.allowPlay;
    },
    set isPlaying(value) {
      playStateManager.isPlaying = value;
    },
    set autoplay(value) {
      playStateManager.autoplay = value;
    },
    set ended(value) {
      playStateManager.ended = value;
    },
    set canPlay(value) {
      playStateManager.canPlay = value;
    },
    set showContinueBtn(value) {
      playStateManager.showContinueBtn = value;
    },
    set removeLoadingScreen(value) {
      playStateManager.removeLoadingScreen = value;
    },
    set allowPlay(value) {
      playStateManager.allowPlay = value;
    }
  };
};
