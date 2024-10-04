import "./lib/commands";

import "./commands/help.command";
import "./commands/list.command";
import "./commands/save.command";
import "./commands/unwatch.command";
import "./commands/watch.command";
import { loadWatchedResources } from "./watcher";

export const thisResource = GetCurrentResourceName();

function loadWatcher() {
	if (!IsPrincipalAceAllowed(`resource.${thisResource}`, "command.ensure")) {
		console.log("^0");
		console.log(`^3[FIVEWATCHER] ^1This resource requires the 'command.ensure' permission to work properly.^0`);
		console.log(`^3[FIVEWATCHER] ^1Please add the following line to your server.cfg:^0`);
		console.log(`^3[FIVEWATCHER] ^0add_principal resource.${thisResource} group.admin^0`);
		console.log("^0");
		StopResource(thisResource);
		return;
	}

	console.log("^0");
	console.log(`^4[FIVEWATCHER] ^0Resource ${thisResource} started.^0`);
	console.log(`^4[FIVEWATCHER] ^0Type ^4'watcher help' ^0to see the available commands.^0`);
	console.log("^0");

	loadWatchedResources();
}

setTimeout(() => {
	loadWatcher();
}, 5000);