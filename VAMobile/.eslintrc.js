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
    'tsdoc/syntax': 'warn',
    'no-console': 0,
    semi: 0,
    'max-len': [
      'error',
      {
        code: 150,
        ignoreStrings: true,
        ignoreTemplateLiterals: true,
        ignoreRegExpLiterals: true,
      },
    ],
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
    'react/no-unstable-nested-components': [
      'warn',
      {
        allowAsProps: true,
      },
    ],
  },
}
