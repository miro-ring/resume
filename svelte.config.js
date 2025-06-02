import { escapeSvelte, mdsvex } from 'mdsvex';
import adapter from '@sveltejs/adapter-static';
import { vitePreprocess } from '@sveltejs/vite-plugin-svelte';
import { resolve } from 'path';
import { createHighlighter } from 'shiki';

/** @type {import('@sveltejs/kit').Config} */
const config = {
	extensions: ['.svelte', '.svx'],
	// Consult https://svelte.dev/docs/kit/integrations
	// for more information about preprocessors
	preprocess: [
		vitePreprocess(),
		mdsvex({
			extensions: ['.svx'],
			highlight: {
				highlighter: async (code, lang) => {
					const highlighter = await createHighlighter({
						themes: ['andromeeda'],
						langs: [
							'javascript',
							'typescript',
							'rust',
							'toml',
							'bash',
							'json',
							'yaml',
							'css',
							'html',
							'markdown'
						]
					});
					const html = escapeSvelte(highlighter.codeToHtml(code, { lang, theme: 'andromeeda' }));
					return `{@html \`${html}\`}`;
				}
			}
		})
	],

	kit: {
		// adapter-auto only supports some environments, see https://svelte.dev/docs/kit/adapter-auto for a list.
		// If your environment is not supported, or you settled on a specific environment, switch out the adapter.
		// See https://svelte.dev/docs/kit/adapters for more information about adapters.
		adapter: adapter({
			fallback: '404.html'
		}),
		alias: {
			$lib: resolve('./lib')
		}
	}
};

export default config;
