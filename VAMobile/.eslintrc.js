module.exports = {
  parser: '@typescript-eslint/parser',
  parserOptions: {
    project: './tsconfig.json',
  },
  plugins: ['@typescript-eslint', 'sort-imports-es6-autofix', 'eslint-plugin-tsdoc'],
  extends: ['@react-native-community', 'plugin:@typescript-eslint/recommended', 'plugin:react-hooks/recommended'],
  env: {
    commonjs: true,
    es6: true,
    node: true,
    browser: false,
  },
  globals: {
    strapi: true,
  },
  ignorePatterns: ['testUtils.tsx', '**/*.test.ts', '**/*.test.tsx', '**/store/reducers/createReducer.ts'],
  rules: {
    'tsdoc/syntax': 'warn',
    'linebreak-style': ['error', 'unix'],
    'no-console': 0,
    semi: 0,
    'no-multiple-empty-lines:': 0,
    'no-shadow': 'off',
    '@typescript-eslint/no-shadow': ['error'],
    '@typescript-eslint/no-unused-vars': 1,
    'no-unused-vars': 'off',
    '@typescript-eslint/ban-ts-ignore': 0,
    '@typescript-eslint/no-empty-function': 0,
    '@typescript-eslint/camelcase': 0,
    '@typescript-eslint/no-empty-interface': 0,
    '@typescript-eslint/ban-ts-comment': 0,
    '@typescript-eslint/member-delimiter-style': [
      2,
      {
        multiline: {
          delimiter: 'none',
          requireLast: true,
        },
        singleline: {
          delimiter: 'semi',
          requireLast: false,
        },
      },
    ],
    'sort-imports-es6-autofix/sort-imports-es6': [
      2,
      {
        ignoreCase: false,
        ignoreMemberSort: false,
        memberSyntaxSortOrder: ['none', 'all', 'multiple', 'single'],
      },
    ],
    /** 
     * This is a new rule added to prevent creating a component inside another component render. This is the warning you get if not turned off
     * 21:22  warning  Do not define components during render. React will see a new component type on every render and destroy the entire subtree’s DOM nodes and 
     * state (https://reactjs.org/docs/reconciliation.html#elements-of-different-types). Instead, move this component definition out of the parent component “NeedHelpData” 
     * and pass data as props  react/no-unstable-nested-components 
     * If we want to keep this rule we would have to set the rule to warn and set allowAsProps to true to allow setting a component as props on the react navigation set.options. Than we would have to 
     * go to any component that is creating a component inside another and abstract that out to it own component file or in the same file outside the parent component. 
     * "react/no-unstable-nested-components": [ "warn",{ "allowAsProps": true }]
     * */
    'react/no-unstable-nested-components':'off'
  },
}
