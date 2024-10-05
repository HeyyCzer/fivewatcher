import { normalize } from "path";

export function beatifyPath(path: string, resourcePath: string): string {
	return path
		.replace(normalize(resourcePath), "")
		.replace(/\\/g, '/');
}