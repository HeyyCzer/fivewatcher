const COMMANDS: Command[] = [];

export function getCommands() {
	return COMMANDS;
}

export function addCommand(command: Command): void {
	COMMANDS.push(command);
}

RegisterCommand("watcher", (source: number, args: string[]) => {
	// If no arguments are provided, show the help message
	if (args.length === 0) args.push("help");

	const command = COMMANDS.find(command => (
		command.name === args[0] || (command.aliases && command.aliases.includes(args[0]))
	));
	if (!command) {
		console.error(`Command ${args[0]} not found.`);
		return;
	}

	command.execute(args.slice(1));
}, true);