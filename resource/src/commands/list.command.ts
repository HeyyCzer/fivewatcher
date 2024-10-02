import { addCommand } from "../lib/commands";
import { getWatchedResources } from "../watcher";

addCommand({
	name: "list",
	aliases: ["l", "list", "files", "resources"],
	description: "List all watched resources",
	execute: () => {
		const resources = getWatchedResources();
		if (resources.length === 0) {
			console.log("^3No resources are being watched! Try 'watcher w <resource_name>' first.^0");
			return;
		}

		console.log("Watched resources:");
		resources.forEach(resource => console.log(`- ${resource}`));
	}
});
