/* eslint-disable */
export default {
  displayName: 'configurations-presentation',
  preset: '../../../nested-libs-jest.preset.js',
  globals: {
    'ts-jest': {
      tsconfig: '<rootDir>/tsconfig.spec.json',
    },
  },
  testEnvironment: 'node',
  transform: {
    '^.+\\.[tj]s$': 'ts-jest',
  },
  moduleFileExtensions: ['ts', 'js', 'html'],
  coverageDirectory: '../../../coverage/libs/configurations/presentation',
  coverageReporters: ['json'],
};