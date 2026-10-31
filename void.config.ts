import { defineConfig } from 'void/config';

export default defineConfig({
	cloudflare: {
		compatibility_date: '2026-05-01',
		compatibility_flags: [
			'nodejs_compat',
			'global_fetch_strictly_public',
			'nodejs_als',
		],
		name: 'thasmo-erna-ole-website',
		observability: {
			enabled: true,
			head_sampling_rate: 1,
		},
		preview_urls: true,
		routes: [
			{
				pattern: 'erna-ole.com',
				custom_domain: true,
			},
			{
				pattern: 'www.erna-ole.com',
				custom_domain: true,
			},
		],
		workers_dev: false,
	},
	inference: {
		appType: 'static',
		build: 'pnpm build',
		outputDir: 'dist/client',
	},
});
