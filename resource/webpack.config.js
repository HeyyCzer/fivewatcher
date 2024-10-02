
export default {
	mode: "production",
	entry: `./src/index.ts`,
	output: {
		filename: `server.js`,
	},
	resolve: {
		extensions: [".ts", ".js"],
	},
	target: "node",
	module: {
		rules: [{ test: /\.tsx?$/, loader: "ts-loader", exclude: /node_modules/ }],
	},
	externals: {
		fsevents: "fsevents",
	},
};
