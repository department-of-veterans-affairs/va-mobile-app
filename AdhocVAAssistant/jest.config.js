const { defaults: tsjPreset } = require('ts-jest/presets')

module.exports = {
	...tsjPreset,
	"preset": "react-native",
	roots: ['<rootDir>/src'],
	transform: {
		...tsjPreset.transform,
		//"^.+\\.[t|j]sx?$": "babel-jest",
		'\\.js$': '<rootDir>/node_modules/react-native/jest/preprocessor.js',
	},

	"moduleNameMapper":{
		"@env":"<rootDir>/env/test.env.ts"
	},
	"testRegex": ".*\\.test\\.tsx?",
	"collectCoverageFrom": [
		"src/**/*.{ts,tsx}",
		"!**/*.test.*"
	],
	"moduleFileExtensions": [
		"ts",
		"tsx",
		"js",
		"jsx",
		"json",
		"node"
	],
	"setupFiles": [
		"./node_modules/react-native-gesture-handler/jestSetup.js",
		"./jest/testSetup.ts"
	],
	
	"setupFilesAfterEnv": [
		"./jest/testSetup.runner.ts"
	],
	"transformIgnorePatterns": [
		"/node_modules/(?!native-base)/"
	],
	globals: {
		'ts-jest': {
			tsConfig: 'tsconfig.test.json',
			babelConfig: 'babel.config.js'
		}
	},
}