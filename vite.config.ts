import { defineConfig } from 'vite';
import { dreamlandPlugin } from 'vite-plugin-dreamland';
import { viteStaticCopy } from 'vite-plugin-static-copy';

import fs from 'fs';
import wbn from 'rollup-plugin-webbundle';
import * as wbnSign from 'wbn-sign';

const plugins = [dreamlandPlugin(), viteStaticCopy({
	targets: [
		{ src: "rust/pkg/wisp_iwa_rust_bg.wasm", dest: "" },
	]
})];

if (process.env.NODE_ENV === 'production') {
	const key = wbnSign.parsePemKey(
		Buffer.from(process.env.KEY || fs.readFileSync('./certs/encrypted_key.pem')),
		process.env.KEY_PASSPHRASE ||
		(await wbnSign.readPassphrase(
			'./certs/encrypted_key.pem',
		)),
	);

	plugins.push({
		...wbn({
			baseURL: new wbnSign.WebBundleId(key).serializeWithIsolatedWebAppOrigin(),
			static: {
				dir: 'public',
			},
			output: 'wisp-iwa.swbn',
			integrityBlockSign: {
				strategy: new wbnSign.NodeCryptoSigningStrategy(key),
			},
		}),
		enforce: 'post',
	});
}

export default defineConfig({
	plugins,
	server: {
		port: 5193,
		strictPort: true,
		hmr: {
			protocol: 'ws',
			host: 'localhost',
			clientPort: 5193,
		},
		headers: {
			"permissions-policy": "direct-sockets"
		}
	},
	base: "./",
});
