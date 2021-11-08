module.exports = {
  presets: [require.resolve('@docusaurus/core/lib/babel/preset'), "@babel/preset-flow"],
  plugins: [
		  ["@babel/plugin-transform-runtime"],
		["module:react-native-dotenv", {
			"moduleName": "@env",
			"path": process.env.DOT_ENV_FILE || "env/.env",
			"blacklist": null,
			"whitelist": null,
			"safe": false,
			"allowUndefined": true
		},],
		[
			require.resolve('babel-plugin-module-resolver'),
			{
				root: ["src", '../src'],
				
				extensions: [
					'.jsx',
					'.ts',
					'.tsx'
				],
			}

		]
	]
};
