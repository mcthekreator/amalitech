import config from './jest.config';

export default {
  ...config,
  testMatch: ['**/+(*.)+(int).+(ts|js)?(x)'],
  coverageThreshold: {
    global: {
      statements: 0,
      branches: 0,
      functions: 0,
      lines: 0,
    },
  },
};
