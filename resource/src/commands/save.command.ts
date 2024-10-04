import { thisResource } from "..";
import { addCommand } from "../lib/commands";
import { getWatchedResources } from "../watcher";

addCommand({
	name: "save",
	aliases: ["s", "p", "persist"],
	description: "Persist current watched resources",
	execute: () => {
		const resources = getWatchedResources();
		SaveResourceFile(thisResource, "watched.json", JSON.stringify(resources, null, 2), -1);
		console.log(`^2Current watched resources have been saved.^0`);
	}
});
