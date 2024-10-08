import { watch, type FSWatcher } from "chokidar";
import debounce from "debounce";
import fg from "fast-glob";
import { thisResource } from ".";
import { extractFilesFromManifest } from "./lib/manifest";
import { beatifyPath } from "./utils/path";

const WATCHED_RESOURCES: WatchedResource[] = [];

const restartResource = debounce(_restartResource, 2000);

export function watchResource(resourceName: string, force?: boolean): boolean {
	if (resourceName === thisResource) {
		console.log(`^3FiveWatcher cannot watch itself.^0`);
		return false;
	}
	
	if (!force && WATCHED_RESOURCES.some(resource => resource.resource === resourceName)) {
		console.log(`^3Resource ^4${resourceName} ^3is already being watched.^0`);
		return false;
	};

	WATCHED_RESOURCES.push({
		resource: resourceName,
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

export function loadWatchedResources() {
	const savedResources = LoadResourceFile(GetCurrentResourceName(), "watched.json");
	if (!savedResources) return;

	const resources = JSON.parse(savedResources) as string[];
	resources.forEach(resource => watchResource(resource, true));
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

		const fileAddedOrChanged = (path: string) => {
			console.log(`File ^2${beatifyPath(path, resourcePath)} ^0in ^2${resourceName} ^0has been added or changed.`);
			restartResource(resourceName);
			stopWatchingResource(resourceName);
			startWatchingResource(resourceName);
		}

		watcher.on("add", fileAddedOrChanged);
		watcher.on("addDir", fileAddedOrChanged);
		watcher.on("change", fileAddedOrChanged);

		watcher.on("unlink", (path) => {
			console.log(`File ^1${beatifyPath(path, resourcePath)} ^0in ^2${resourceName} ^0has been removed and will no longer be watched.`);
			restartResource(resourceName);
			stopWatchingResource(resourceName);
			startWatchingResource(resourceName);
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

function _restartResource(resourceName: string) {
	setTimeout(() => {
		ExecuteCommand(`refresh`);
		ExecuteCommand(`ensure ${resourceName}`);
	}, 100);
}