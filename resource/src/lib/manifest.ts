function extractPatterns(content: string, keyword: string): string[] {
    const regex = new RegExp(`${keyword}\\s*(\\{[^\\}]*\\}|".*?"|'.*?')`, 'gs');
    const matches: string[] = [];
    let match;

    // Find all matches for the given keyword
    while ((match = regex.exec(content)) !== null) {
        let raw = match[1]; // Extract the part inside quotes or brackets

        // Remove curly braces if found, and then split by commas
        if (raw.startsWith('{')) {
            raw = raw.slice(1, -1).trim(); // Remove the curly braces
        }

        // Split values by commas, clean up extra quotes/spaces, filter out empty values
        const extractedValues = raw
            .split(/,\s*/) // Split by comma
            .map(value => value.replace(/['"]/g, '').trim()) // Remove quotes and trim
            .filter(value => value.length > 0); // Filter out empty strings

        matches.push(...extractedValues);
    }

    return matches;
}

export function extractFilesFromManifest(manifestContent: string): Set<string> {
	const files = new Set<string>([
		...extractPatterns(manifestContent, "client_script"),
		...extractPatterns(manifestContent, "client_scripts"),
		...extractPatterns(manifestContent, "server_script"),
		...extractPatterns(manifestContent, "server_scripts"),
		...extractPatterns(manifestContent, "shared_script"),
		...extractPatterns(manifestContent, "shared_scripts"),
		...extractPatterns(manifestContent, "file"),
		...extractPatterns(manifestContent, "files"),
	]);

	// Add the manifest file itself
	files.add("fxmanifest.lua");

	return files;
}
