/** @type {import('jest').Config} */
module.exports = {
  preset: 'react-native',
  maxWorkers: 1,
  testEnvironment: './e2e/environment',
  setupFilesAfterEnv: ['./e2e/setup.ts'],
  verbose: true,
  reporters: [
    'detox/runners/jest/reporter',
    [
      'jest-junit',
      {
        outputDirectory: '<rootDir>/e2e/test_reports',
        outputName: 'e2e-junit.xml',
      },
    ],
  ],
  globalSetup: 'detox/runners/jest/globalSetup',
  globalTeardown: 'detox/runners/jest/globalTeardown',
  testTimeout: 400000,
  testRegex: '\\.e2e\\.ts$',
  transform: {
    '^.+\\.tsx?$': [
      'ts-jest',
      {
        tsconfig: 'tsconfig.test.json',
        babelConfig: 'babel.config.js',
      },
    ],
  },
  transformIgnorePatterns: ['jest-runner', '/node_modules/(?!native-base)/'],
  moduleNameMapper: {
    '@env': '<rootDir>/env/test.env.ts',
  },
}
