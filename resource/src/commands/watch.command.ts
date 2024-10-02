import { addCommand } from "../lib/commands";
import { watchResource } from "../watcher";

addCommand({
	name: "watch",
	aliases: ["w", "track", "observe"],
	description: "Watch for changes in a resource",
	execute: (args) => {
		watchResource(args[0]);
	}
});
