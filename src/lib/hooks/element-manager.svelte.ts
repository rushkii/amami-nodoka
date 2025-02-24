import type { MediaElementState } from '$types';

const elementManager = $state<MediaElementState>({
  videoIntro: null,
  videoLoop: null,
  audio: null,
  bgm: null,
  loadingElement: null
});

export const useElementManager = () => {
  return {
    get videoIntro() {
      return elementManager.videoIntro;
    },
    get videoLoop() {
      return elementManager.videoLoop;
    },
    get audio() {
      return elementManager.audio;
    },
    get bgm() {
      return elementManager.bgm;
    },
    get loadingElement() {
      return elementManager.loadingElement;
    },
    set videoIntro(value) {
      elementManager.videoIntro = value;
    },
    set videoLoop(value) {
      elementManager.videoLoop = value;
    },
    set audio(value) {
      elementManager.audio = value;
    },
    set bgm(value) {
      elementManager.bgm = value;
    },
    set loadingElement(value) {
      elementManager.loadingElement = value;
    }
  };
};
