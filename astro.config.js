import sitemap from '@astrojs/sitemap';
import { defineConfig } from 'astro/config';
import unocss from 'unocss/astro';

export default defineConfig({
	base: '/',
	output: 'static',
	integrations: [
		unocss(),
		sitemap(),
	],
	prefetch: {
		defaultStrategy: 'tap',
		prefetchAll: true,
	},
	trailingSlash: 'never',
});
