interface Command {
	name: string;
	aliases?: string[];
	description: string;
	isConsoleOnly?: boolean;
	execute: (args: string[]) => void;
}
