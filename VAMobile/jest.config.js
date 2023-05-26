const { defaults: tsjPreset } = require('ts-jest/presets')

module.exports = {
  ...tsjPreset,
  preset: 'react-native',
  roots: ['<rootDir>/src'],
  reporters: ['default', 'jest-junit'],
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

  moduleNameMapper: {
    '@env': '<rootDir>/env/test.env.ts',
    '\\.svg': '<rootDir>/jest/svgMock.ts',
  },
  testRegex: '.*\\.test\\.tsx?',
  collectCoverageFrom: ['src/**/*.{ts,tsx}', '!**/store/api/types/index.*', '!**/store/api/index.*', '!**/*.test.*'],
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json', 'node'],
  setupFiles: ['./node_modules/react-native-gesture-handler/jestSetup.js', './jest/testSetup.ts'],

  setupFilesAfterEnv: ['./jest/testSetup.runner.ts'],
  transformIgnorePatterns: ['jest-runner', '/node_modules/(?!native-base)/'],
}
