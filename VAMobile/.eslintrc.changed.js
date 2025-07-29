module.exports = {
  parser: '@typescript-eslint/parser',
  parserOptions: {
    project: './tsconfig.json',
  },
  plugins: ['@typescript-eslint', 'eslint-plugin-tsdoc', 'jest'],
  extends: [
    '@react-native',
    'plugin:@typescript-eslint/recommended',
    'plugin:react-hooks/recommended',
    '@department-of-veterans-affairs/mobile',
    'prettier',
    'plugin:react-native-a11y/basic',
  ],
  env: {
    commonjs: true,
    es6: true,
    node: true,
    browser: false,
    jest: true,
  },
  globals: {
    strapi: true,
  },
  ignorePatterns: ['jsonFormatting.ts'],
  rules: {
    'react/no-unstable-nested-components': 0,
    '@typescript-eslint/ban-ts-comment': 0,
    // 'no-restricted-imports': [
    //   'error',
    //   {
    //     patterns: ['.*'],
    //   },
    // ],
  },
}
