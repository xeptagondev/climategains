#!/usr/bin/env node
/* eslint-disable no-console */
/* eslint-disable @typescript-eslint/no-var-requires */

// Runs one of scripts/index.js's exported functions by name, e.g. `node scripts/run.js buildAndroid`.
// Exists so package.json scripts don't need `node -e '...'` with quoting that only bash understands —
// npm always launches script commands through cmd.exe on Windows, which doesn't strip single quotes,
// so the whole `-e` argument used to get mis-parsed and silently no-op instead of running anything.

const scripts = require('./index.js');

const name = process.argv[2];
const fn = scripts[name];

if (typeof fn !== 'function') {
	console.error(`[scripts] Unknown script: "${name}"`);
	console.error(`[scripts] Available: ${Object.keys(scripts).join(', ')}`);
	process.exit(1);
}

console.log(`[scripts] ▶ ${name} started`);

const fail = err => {
	console.error(`[scripts] ✖ ${name} failed${err ? `: ${err.message || err}` : ''}`);
	process.exitCode = 1;
};

try {
	const result = fn();
	if (result && typeof result.on === 'function') {
		// Async path (execute()) — result is the ChildProcess, wait for it to actually finish.
		result.on('exit', code => {
			if (code === 0) console.log(`[scripts] ✔ ${name} completed successfully`);
			else fail(new Error(`exit code ${code}`));
		});
		result.on('error', fail);
	} else {
		// Sync path (executeWithSync) — already ran to completion without throwing.
		console.log(`[scripts] ✔ ${name} completed successfully`);
	}
} catch (err) {
	fail(err);
}
