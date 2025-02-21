export const easing = (duration: number) => {
  // easing calculation.
  return 0.5 - Math.cos(duration * Math.PI) / 2;
};

export const fadeAudio = ({
  audio,
  to,
  duration
}: {
  audio: HTMLAudioElement;
  to: number;
  duration: number;
}): Promise<void> => {
  // audio fade volume.
  // ref: https://stackoverflow.com/a/13149848

  const volume = audio.volume;
  const delta = to - volume;
  const interval = 13;

  const ticks = Math.floor(duration / interval);
  let tick = 1;

  return new Promise<void>((resolve) => {
    const timer = setInterval(() => {
      audio.volume = volume + easing(tick / ticks) * delta;

      if (++tick === ticks + 1) {
        clearInterval(timer);
        resolve();
      }
    }, interval);
  });
};
