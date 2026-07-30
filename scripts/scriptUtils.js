/* eslint-disable @typescript-eslint/no-var-requires */
/* eslint-disable no-console */
const os = require('os');
const { exec, execSync } = require('child_process');

const path = require('node:path');
const { readFileSync, writeFileSync } = require('node:fs');

const { serverPort } = require('../build/config.js');

/**
 * It executes a command and logs the output to the console
 */
const execute = command => {
	console.log(`[scripts] Running: ${command}`);
	const child = exec(command);
	child.stdout?.on('data', data => process.stdout.write(data));
	child.stderr?.on('data', data => process.stderr.write(data));
	child.on('error', err => console.error(`[scripts] Failed to start: ${command}\n${err.message}`));
	child.on('exit', code => {
		if (code === 0) console.log(`[scripts] Finished: ${command}`);
		else console.error(`[scripts] Failed (exit code ${code}): ${command}`);
	});
	return child;
};

/**
 * It executes a command with sync ( for live loading commands like dev ) and prints the output to the console
 */
const executeWithSync = command => {
	console.log(`[scripts] Running: ${command}`);
	try {
		execSync(command, { stdio: 'inherit' });
		console.log(`[scripts] Finished: ${command}`);
	} catch (err) {
		console.error(`[scripts] Failed: ${command}`);
		throw err;
	}
};

/**
 * Get the IPv4 address of the first network interface that isn't internal
 */
const getIP = () =>
	Object.values(os.networkInterfaces())
		.flat()
		.filter(item => !item.internal && item.family === 'IPv4')
		.find(Boolean).address;

/**
 * It reads the capacitor.config.json file, deletes the server property if it exists, and then adds it
 * back in with the correct IP address and port
 * @param [addLiveServer=false] - boolean - if true, the capacitor.config.json file will be updated
 * with the live server url.
 */
const updateCapacitorConfig = (addLiveServer = true) => {
	const filePath = path.resolve('capacitor.config.json');
	const fileToEdit = JSON.parse(readFileSync(filePath, { encoding: 'utf8' }));
	if (fileToEdit.server) delete fileToEdit.server;
	if (addLiveServer) {
		const url = `http://${getIP()}:${serverPort}`;
		fileToEdit.server = { url, clearText: true };
		console.log(`[scripts] capacitor.config.json: live server set to ${url}`);
	} else {
		console.log('[scripts] capacitor.config.json: live server config removed');
	}
	writeFileSync(filePath, JSON.stringify(fileToEdit, null, 2));
};

module.exports = {
	execute,
	executeWithSync,

	updateCapacitorConfig
};
