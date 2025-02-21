<script lang="ts">
  import { browser } from '$app/environment';
  import { preloadAssets } from '$helpers/loader';
  import { ASSETS } from '$lib/constants';
  import type { MediaElementState, MediaPlayState } from '$types';
  import { onMount } from 'svelte';

  let media = $state<MediaElementState>();
  let playState = $state<MediaPlayState>();

  const startLoadAssets = () => {
    if (!screen.orientation.type.includes('landscape')) return;
    preloadAssets({ assets: ASSETS });
  };

  onMount(() => {
    console.log('onMount');
    if (!browser || !media || !playState) return;

    console.log('startLoadAssets start');
    startLoadAssets();
    console.log('startLoadAssets end');

    media.videoIntro.onended = () => {
      media.videoIntro.oncanplay = null;
      media.videoIntro.classList.remove('z-[1]');

      media.videoLoop.classList.remove('z-[-1]');
      media.videoLoop.classList.add('z-[1]');
      media.videoLoop.play();

      setTimeout(() => {
        // use timeout for letting the looped video play first.
        media.videoIntro.remove();
      }, 1000);

      playState.canPlay = true;
    };
  });
</script>

<video
  bind:this={media?.videoIntro}
  preload="auto"
  class="absolute top-0 left-0 z-[1] h-screen
          w-screen object-cover brightness-[80%]"
>
  <track kind="captions" />
  <source type="video/webm" />
</video>
