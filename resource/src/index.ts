import "./lib/commands";

import "./commands/help.command";
import "./commands/list.command";
import "./commands/unwatch.command";
import "./commands/watch.command";

export const thisResource = GetCurrentResourceName();

if (!IsPrincipalAceAllowed(`resource.${thisResource}`, "command.ensure")) {
	console.error(`This resource requires the 'command.ensure' permission to work properly.`);
	console.error(`Please add the following line to your server.cfg:`);
	console.error(`add_principal resource.${thisResource} group.admin`);
	StopResource(thisResource);
}

setTimeout(() => {
	console.log("")
	console.log(`^4[WATCHER] ^0Resource ${thisResource} started.`);
	console.log(`^4[WATCHER] ^0Type ^4'watcher help' ^0to see the available commands.`);
	console.log("")
}, 0);