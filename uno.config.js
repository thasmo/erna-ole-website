import presetBasic from '@somehow-digital/unocss-preset';
import presetFonts from '@unocss/preset-web-fonts';
import { createLocalFontProcessor } from '@unocss/preset-web-fonts/local';
import {
	defineConfig,
	transformerDirectives,
	transformerVariantGroup,
} from 'unocss';

export default defineConfig({
	presets: [
		presetBasic(),
		presetFonts({
			fonts: {
				base: {
					name: 'Panchang',
					weights: ['400', '700'],
				},
			},
			processors: createLocalFontProcessor({
				cacheDir: 'node_modules/.cache/unocss/fonts/',
				fontAssetsDir: 'public/assets/fonts/',
				fontServeBaseUrl: '/assets/fonts/',
			}),
			provider: 'fontshare',
		}),
	],
	theme: {
		colors: {
			base: '#111',
			accent: 'hotpink',
		},
		breakpoints: {
			sm: '480px',
		},
	},
	transformers: [
		transformerDirectives(),
		transformerVariantGroup(),
	],
	preflights: [
		{
			getCSS: ({ theme }) => `
				::selection {
					background-color: ${theme.colors?.accent};
					color: ${theme.colors?.blank};
				}
				:root {
					position: relative;
					overflow: hidden;
					height: 100%;
					width: 100%;
					color: ${theme.colors?.base};
					cursor: var(--cursor, default);
					font-family: "Roboto Slab", sans-serif;
					font-size: 16px;
					font-weight: 300;
					line-height: 1.5;
					text-align: center;
				}
				:root::after {
					content: "";
					opacity: 0.5;
					background-color: #0000;
					background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 600 600'%3E%3Cfilter id='a'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23a)'/%3E%3C/svg%3E");
					background-repeat: repeat;
					background-size: 182px;
					width: 100%;
					height: 100%;
					position: absolute;
					top: 0;
					left: 0;
				}
		   `,
		},
	],
});
