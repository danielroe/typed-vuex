module.exports = {
  verbose: true,
  projects: ['<rootDir>/packages/*/jest.config.js'],
  testEnvironment: 'node',
  collectCoverage: true,
  coverageThreshold: {
    global: {
      branches: 100,
      functions: 100,
      lines: 100,
      statements: 100,
    },
  },
}
