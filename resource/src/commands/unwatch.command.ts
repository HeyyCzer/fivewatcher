import { addCommand } from "../lib/commands";
import { unwatchResource } from "../watcher";

addCommand({
	name: "unwatch",
	aliases: ["u", "uw", "untrack", "unobserve"],
	description: "Stop watching for changes in a resource",
	execute: (args) => {
		unwatchResource(args[0]);
	}
});
