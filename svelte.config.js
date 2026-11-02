import { vitePreprocess } from '@sveltejs/vite-plugin-svelte'

/** @type {import("@sveltejs/vite-plugin-svelte").SvelteConfig} */
export default {
  // Consult https://svelte.dev/docs#compile-time-svelte-preprocess
  // for more information about preprocessors
  preprocess: vitePreprocess(),
  compilerOptions: {
    // compiler complains but it works
    // replace css-classes svelte-xxxx with dnxp-xxxx
    cssHash: ({ hash, css }) => 'dnxp-' + hash(css) 
  },
}
