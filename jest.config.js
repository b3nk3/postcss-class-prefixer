module.exports = {
  testEnvironment: 'node',
  coverageThreshold: {
    global: {
      statements: 100,
    },
  },
  testPathIgnorePatterns: ['/node_modules/', '/dist/'],
  transform: {
    '^.+\\.tsx?$': 'ts-jest',
  },
};
