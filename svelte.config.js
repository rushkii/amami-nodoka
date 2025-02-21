import adapter from '@sveltejs/adapter-vercel';
import { vitePreprocess } from '@sveltejs/vite-plugin-svelte';

/** @type {import('@sveltejs/kit').Config} */
const config = {
  // Consult https://svelte.dev/docs/kit/integrations
  // for more information about preprocessors
  preprocess: vitePreprocess(),

  kit: {
    adapter: adapter(),
    alias: {
      $components: 'src/lib/components',
      $helpers: 'src/lib/helpers',
      $hooks: 'src/lib/hooks',
      $types: 'src/lib/types.d.ts'
    }
  }
};

export default config;
