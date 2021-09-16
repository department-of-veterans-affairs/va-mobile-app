
module.exports = {
	presets: ['module:metro-react-native-babel-preset'],
	
	plugins: [
		["module:react-native-dotenv", {
			"moduleName": "@env",
			"path": process.env.DOT_ENV_FILE || "env/.env",
			"blacklist": null,
			"whitelist": null,
			"safe": false,
			"allowUndefined": true
		}, 'react-native-reanimated/plugin',],
		[
			require.resolve('babel-plugin-module-resolver'),
			{
				root: ["src"],
				
				extensions: [
					'.js',
					'.jsx',
					'.ts',
					'.tsx',
					'.android.js',
					'.android.tsx',
					'.ios.js',
					'.ios.tsx'
				],
			}

		]

	]
};
