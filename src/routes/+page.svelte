<script lang="ts">
  import { browser } from '$app/environment';
  import { calculatePercent, formatBytes } from '$helpers';
  import { preloadAssets } from '$helpers/loader';
  import { useAssetsManager } from '$hooks/assets-manager.svelte';
  import { useElementManager } from '$hooks/element-manager.svelte';
  import { usePlayStateManager } from '$hooks/playstate-manager.svelte';
  import { ASSETS } from '$lib/constants';
  import { onMount } from 'svelte';
  import { fade } from 'svelte/transition';

  let assetsManager = useAssetsManager();
  let media = useElementManager();
  let playState = usePlayStateManager();

  let progress = $state(0);
  let totalSize = $state(0);

  const play = () => {
    // play button after the loading assets is finished.
    if (!playState.showContinueBtn || !playState.allowPlay) return;

    playState.removeLoadingScreen = true;
    playState.showContinueBtn = false;

    media.bgm!.loop = true;
    media.bgm!.play();

    media.videoIntro!.play();

    // play & pause to prevent error:
    // `NotAllowedError: play() can only be initiated
    // by a user gesture.`
    media.videoLoop!.play();
    media.videoLoop!.pause();
    media.videoLoop!.currentTime = 0;
  };

  const startLoadAssets = () => {
    if (!screen.orientation.type.includes('landscape')) return;
    preloadAssets({ assets: ASSETS });
  };

  const animateLoading = (iterationDuration: number = 200) => {
    // loading animation UI logic.
    // ref: https://stackoverflow.com/a/57548666

    if (!browser) return;

    window.requestAnimationFrame(function () {
      const percent = calculatePercent(progress, totalSize);

      media.loadingElement!.style.width = `${percent}%`;
      media.loadingElement!.style.transitionDuration = `${iterationDuration}ms`;

      const next = (percent === undefined ? 0 : percent) + 1;
      if (next <= 100) {
        setTimeout(animateLoading, iterationDuration, media.loadingElement, iterationDuration);
      }
    });
  };

  onMount(() => {
    if (!browser || !media.videoIntro || !playState) return;

    startLoadAssets();

    media.videoIntro.onended = () => {
      media.videoIntro!.oncanplay = null;
      media.videoIntro!.classList.remove('z-[1]');

      media.videoLoop!.classList.remove('z-[-1]');
      media.videoLoop!.classList.add('z-[1]');
      media.videoLoop!.play();

      setTimeout(() => {
        // use timeout for letting the looped video play first.
        media.videoIntro!.remove();
      }, 1000);

      playState.canPlay = true;
    };
  });

  $effect(() => {
    // reactive ($:) state area to watch assets state progress.

    progress = assetsManager.progress.reduce(
      (accumulator, current) => accumulator + (current.size ?? 0),
      0
    );

    totalSize = assetsManager.totalSize;

    animateLoading();

    if (assetsManager.assets.length === ASSETS.length) {
      // if preloaded assets completely loaded then run the logic.
      media.bgm = new Audio(assetsManager.assets.find((e) => e.type === 'bgm')?.src);
      media.bgm.volume = 0.3;

      media.videoIntro!.src = assetsManager.assets.find((e) => e.type === 'video-intro')?.src!;

      media.videoLoop!.src = assetsManager.assets.find((e) => e.type === 'video-loop')?.src!;
      media.videoLoop!.loop = true;
    }
  });
</script>

<!-- svelte-ignore a11y_click_events_have_key_events -->
<!-- svelte-ignore a11y_no_static_element_interactions -->
<!-- svelte-ignore element_invalid_self_closing_tag -->

<div class="relative top-0 left-0 h-screen w-screen">
  <div
    class="absolute top-0 left-0 z-[999] flex h-screen w-screen flex-col items-center justify-center
          bg-neutral-800 text-center text-balance text-white uppercase landscape:hidden"
  >
    <div class="text-3xl font-bold md:text-4xl">Rotate your screen!</div>
    <div class="mt-1 text-xs font-medium sm:text-sm">
      Sorry, this site only works on landscape screen
    </div>
  </div>

  <div
    onclick={play}
    class="absolute top-0 left-0 h-screen w-screen
      bg-neutral-800 transition duration-1000
      {playState.removeLoadingScreen ? 'z-0 opacity-0' : ' z-40 opacity-100'}"
  >
    <div class="relative flex min-h-screen justify-center p-[1vw]">
      <div
        class="absolute top-0 left-0 flex h-screen w-screen flex-col items-center justify-center text-white
        {playState.removeLoadingScreen ? 'z-0 opacity-0' : ' z-40 opacity-100'}"
      >
        {#if assetsManager.assets.length !== ASSETS.length}
          <div
            transition:fade={{ duration: 200 }}
            onoutroend={() => (playState.showContinueBtn = true)}
            class="space-y-[.5vw]"
          >
            <div class="flex w-screen justify-center">
              <div class="flex flex-col">
                <div class="relative w-[40vw] text-[1vw] font-semibold">
                  <div
                    class="mb-[.3vw] flex animate-pulse items-center justify-center text-[1.2vw]"
                  >
                    {assetsManager.state}
                  </div>
                  <div class="h-[1.5vw] overflow-hidden rounded-md border border-neutral-600">
                    <div
                      bind:this={media.loadingElement}
                      class="transition-loading z-10 flex h-full w-0 items-center justify-end bg-white"
                    >
                      <span class="mr-1 text-[1vw] font-bold text-black">
                        {calculatePercent(progress, totalSize).toFixed(0)}%
                      </span>
                    </div>

                    <div class="-z-10 w-full" />
                  </div>
                  <div class="mt-[.3vw] flex items-end justify-between">
                    <div>{formatBytes(progress)} / {formatBytes(assetsManager.totalSize)}</div>
                    <div>({assetsManager.assets.length + 1}/{ASSETS.length})</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        {/if}
      </div>

      <div
        class="absolute top-0 left-0 flex h-screen w-screen flex-col items-center justify-center text-white
        {playState.removeLoadingScreen ? 'z-0 opacity-0' : ' z-40 opacity-100'}"
      >
        {#if playState.showContinueBtn}
          <div
            transition:fade={{ duration: 500, delay: 100 }}
            onintroend={() => (playState.allowPlay = true)}
            class="animate-pulse text-center text-[2vw] font-semibold uppercase"
          >
            click anywhere to continue
          </div>
        {/if}
      </div>
    </div>
  </div>
</div>
