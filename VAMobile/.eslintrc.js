module.exports = {
	"parser": "@typescript-eslint/parser",
	"parserOptions": {
		"project": "./tsconfig.json"
	},
	"plugins": ["@typescript-eslint", "sort-imports-es6-autofix"],
	"extends": [
		"@react-native-community",
		"plugin:@typescript-eslint/recommended"
	],
	"env": {
		"commonjs": true,
		"es6": true,
		"node": true,
		"browser": false
	},
	"globals": {
		"strapi": true
	},
	"ignorePatterns": ["testUtils.tsx", "**/*.test.ts", "**/*.test.tsx", "**/store/reducers/createReducer.ts"],
	"rules": {
		"linebreak-style": ["error", "unix"],
		"no-console": 0,
		"semi": 0,
		"no-multiple-empty-lines:": 0,
		"@typescript-eslint/ban-ts-ignore": 0,
		"@typescript-eslint/no-empty-function": 0,
		"@typescript-eslint/camelcase": 0,
		"@typescript-eslint/no-empty-interface": 0,
		"@typescript-eslint/member-delimiter-style": [2, {
			"multiline": {
				"delimiter": 'none',
				"requireLast": true
			},
			"singleline": {
				"delimiter": 'semi',
				"requireLast": false
			}

		}],
		"sort-imports-es6-autofix/sort-imports-es6": [2, {
			"ignoreCase": false,
			"ignoreMemberSort": false,
			"memberSyntaxSortOrder": ["none", "all", "multiple", "single"]
		}]
	}
}
