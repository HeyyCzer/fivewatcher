import { addCommand, getCommands } from "../lib/commands";

addCommand({
	name: "help",
	aliases: ["h", "commands"],
	description: "Show the help message",
	execute: () => {
		console.log("Available commands:");
		getCommands().forEach(command => {
			console.log(`^4- ^0${command.name}^4: ^0${command.description}^0`);
			if (command.aliases.length > 0) {
				console.log(`\t^4Aliases: ^6${command.aliases.join(", ")}^0`);
			}
		});
	}
});
