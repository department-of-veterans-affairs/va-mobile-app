const { defaults: tsjPreset } = require('ts-jest/presets')

/** @type {import('jest').Config} */
module.exports = {
  ...tsjPreset,
  preset: 'react-native',
  maxWorkers: 1,
  testEnvironment: "./e2e/environment",
  setupFilesAfterEnv: ["./e2e/setup.ts"],
  testRunner: "jest-circus/runner",
  testTimeout: 120000,
  testRegex: "\\.e2e\\.ts$",
  transform: {
    ...tsjPreset.transform,
    '^.+\\.tsx?$': [
      'ts-jest',
      {
        tsconfig: 'tsconfig.test.json',
        babelConfig: 'babel.config.js',
      },
    ],
  },
  reporters: ["detox/runners/jest/streamlineReporter"],
  verbose: true,
  transformIgnorePatterns: ['jest-runner', '/node_modules/(?!native-base)/'],
  moduleNameMapper: {
    '@env': '<rootDir>/env/test.env.ts'
  },
};

