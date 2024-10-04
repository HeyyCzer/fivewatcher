const COMMANDS: Command[] = [];

export function getCommands() {
	return COMMANDS;
}

export function addCommand(command: Command): void {
	// Check if the command name is already in use
	if (COMMANDS.some(c => c.name === command.name || (c.aliases && c.aliases.includes(command.name)))) {
		console.error(`Command ${command.name} already exists.`);
		return;
	}

	// Check if any of the aliases are already in use
	for (const alias of command.aliases || []) {
		if (COMMANDS.some(c => c.name === alias || (c.aliases && c.aliases.includes(alias)))) {
			console.error(`A command with ${alias} already exists.`);
			return;
		}
	}

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