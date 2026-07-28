// eslint-disable-next-line @typescript-eslint/no-var-requires
const { execute, executeWithSync } = require('./scriptUtils.js');
const { rmSync } = require('node:fs');
const husky = require('husky');

const commitlintHookCmd = 'npx --no -- commitlint --verbose --edit $1';

/**
 * It installs the project dependencies, removes the husky config incase already installed, re-installs husky, and adds a
 * commit-msg hook that runs commitlint
 */
const projectSetup = () => {
	console.log('[scripts] Removing existing .husky directory (if any)...');
	rmSync('.husky', { recursive: true, force: true });

	executeWithSync('pnpm install');

	// Calling husky's own install()/add() directly rather than shelling out to its CLI — the CLI's
	// `husky add <file> "<cmd>"` needs the <cmd> argument passed through as one literal, unexpanded
	// string (it contains a literal `$1`), but cmd.exe (which Node's child_process always shells out
	// through on Windows, regardless of the invoking terminal) doesn't understand the quoting needed
	// to do that — it silently mis-splits the argument instead of erroring.
	husky.install();
	husky.add('.husky/commit-msg', commitlintHookCmd);
};

// House keeping
/**
 * It runs the prettier command on the src and scripts folders, and overwrites the files with the
 * formatted version
 */
const format = () => execute('npx prettier ./src ./scripts -w');
/**
 * `lint` runs `eslint` on all `.js`, `.ts`, and `.vue` files in the `src` and `scripts` directories,
 * ignoring files in the `.gitignore` file, and fixes any errors it finds
 */
const lint = () => execute('npx eslint --ext .js,.ts,.vue --ignore-path .gitignore --fix src scripts');

module.exports = {
	projectSetup,
	format,
	lint
};
