import { watch, type FSWatcher } from "chokidar";
import debounce from "debounce";
import fg from "fast-glob";

const WATCHED_RESOURCES: WatchedResource[] = [];

const restartResource = debounce(_restartResource, 1000);

export function watchResource(resourceName: string, force?: boolean): boolean {
	if (!force && WATCHED_RESOURCES.some(resource => resource.resource === resourceName)) {
		console.log(`^3Resource ^4${resourceName} ^3is already being watched.^0`);
		return false;
	};

	WATCHED_RESOURCES.push({
		resource: resourceName,
		files: []
	});
	startWatchingResource(resourceName);

	console.log(`^2Resource ^4${resourceName} ^2is now being watched.^0`);
	return true;
}

export function unwatchResource(resourceName: string): boolean {
	const index = WATCHED_RESOURCES.findIndex(resource => resource.resource === resourceName);
	if (index === -1) {
		console.log(`^3Resource ^1${resourceName} ^3is not being watched.^0`);
		return false;
	};

	WATCHED_RESOURCES.splice(index, 1);
	stopWatchingResource(resourceName);

	console.log(`^2Resource ^3${resourceName} ^2is no longer being watched.^0`);
	return true;
}

export function getWatchedResources(): string[] {
	return WATCHED_RESOURCES.map(resource => resource.resource);
}

const WATCHERS: {
	resource: string;
	file: string;
	watcher: FSWatcher;
}[] = [];
function startWatchingResource(resourceName: string) {
	const resourcePath = GetResourcePath(resourceName);
	const resourceManifest = LoadResourceFile(resourceName, "fxmanifest.lua");
	if (!resourceManifest) {
		console.error(`Failed to load manifest for resource ${resourceName}.`);
		return;
	}

	stopWatchingResource(resourceName);

	// Get all files from the manifest
	const manifestFiles = extractFilesFromManifest(resourceManifest);

	fg.sync([...manifestFiles], {
		cwd: resourcePath,
	}).forEach(file => {
		const filePath = `${resourcePath}/${file}`;
		const watcher = watch(filePath, {
			ignoreInitial: true
		});

		watcher.on("change", (path) => {
			console.log(`File ^4${path.replace(resourcePath, "")} ^0has been changed.`);
			restartResource(resourceName);
		});

		watcher.on("unlink", (path) => {
			console.log(`File ^1${path.replace(resourcePath, "")} ^0has been removed and will no longer be watched.`);
			restartResource(resourceName);
			watcher.close();
		});

		WATCHERS.push({
			resource: resourceName,
			file: file,
			watcher
		});
	});
}

function stopWatchingResource(resourceName: string) {
	const watchers = WATCHERS.filter(watcher => watcher.resource === resourceName);
	watchers.forEach(watcher => watcher.watcher.close());
}

function extractFilesFromManifest(manifestContent: string): Set<string> {
	const files = new Set<string>([
		...extractPatterns(manifestContent, "client_script"),
		...extractPatterns(manifestContent, "client_scripts"),
		...extractPatterns(manifestContent, "server_script"),
		...extractPatterns(manifestContent, "server_scripts"),
		...extractPatterns(manifestContent, "shared_script"),
		...extractPatterns(manifestContent, "shared_scripts"),
		...extractPatterns(manifestContent, "file"),
		...extractPatterns(manifestContent, "files"),
	]);

	// Add the manifest file itself
	files.add("fxmanifest.lua");

	return files;
}

function extractPatterns(content: string, keyword: string): string[] {
    const regex = new RegExp(`${keyword}\\s*(\\{[^\\}]*\\}|".*?"|'.*?')`, 'gs');
    const matches: string[] = [];
    let match;

    // Find all matches for the given keyword
    while ((match = regex.exec(content)) !== null) {
        let raw = match[1]; // Extract the part inside quotes or brackets

        // Remove curly braces if found, and then split by commas
        if (raw.startsWith('{')) {
            raw = raw.slice(1, -1).trim(); // Remove the curly braces
        }

        // Split values by commas, clean up extra quotes/spaces, filter out empty values
        const extractedValues = raw
            .split(/,\s*/) // Split by comma
            .map(value => value.replace(/['"]/g, '').trim()) // Remove quotes and trim
            .filter(value => value.length > 0); // Filter out empty strings

        matches.push(...extractedValues);
    }

    return matches;
}

function _restartResource(resourceName: string) {
	ExecuteCommand(`ensure ${resourceName}`);
}