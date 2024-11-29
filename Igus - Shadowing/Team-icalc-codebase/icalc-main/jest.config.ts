const { getJestProjects } = require('@nx/jest');

export default {
  projects: getJestProjects(),
  coverageThreshold: {
    global: {
      statements: 0,
      branches: 0,
      functions: 0,
      lines: 0,
    },
  },
};
