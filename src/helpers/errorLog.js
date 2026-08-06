import { Filesystem, Directory, Encoding } from '@capacitor/filesystem';

const LOG_FILE = 'app-error-log.txt';

function serializeError(error) {
	if (error instanceof Error) return `${error.name}: ${error.message}\n${error.stack || ''}`;
	if (typeof error === 'string') return error;
	try {
		return JSON.stringify(error);
	} catch {
		return String(error);
	}
}

// Best-effort on-device error log. There is no remote crash reporting (Sentry/Crashlytics/etc.)
// wired up for this app, so this is the only trace we get of a JS-level failure on a user's
// device. Appends only, and never throws itself — a logging failure must never take down the
// app it's trying to protect. Pull `app-error-log.txt` from the app's Data directory (e.g. via
// `adb pull` on Android, or Capacitor's Filesystem inspector) when investigating a report.
//
// Note: this only sees JS-level exceptions/rejections. A genuine native crash (a Java/Kotlin
// exception inside a Capacitor plugin, for example) happens below the JS engine and never
// reaches this handler — the OS-level "app has stopped" prompt is the only signal for those.
async function logError(context, error, extra) {
	const timestamp = new Date().toISOString();
	const message = serializeError(error);
	const line = `[${timestamp}] [${context}]${extra ? ` (${extra})` : ''} ${message}\n---\n`;

	// Always surface to the JS console too — visible in `adb logcat` / a remote inspector
	// without needing to pull the file off the device.
	console.error(`[error-log] ${context}:`, error, extra || '');

	try {
		await Filesystem.appendFile({
			path: LOG_FILE,
			data: line,
			directory: Directory.Data,
			encoding: Encoding.UTF8
		});
	} catch {
		// appendFile requires the file to already exist on some platforms — fall back to
		// creating it once, then future calls hit the appendFile path above.
		try {
			await Filesystem.writeFile({
				path: LOG_FILE,
				data: line,
				directory: Directory.Data,
				encoding: Encoding.UTF8
			});
		} catch {
			// Nothing more we can do — swallow rather than risk compounding the failure.
		}
	}
}

export { logError, LOG_FILE };
