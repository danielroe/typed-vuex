module.exports = {
  roots: ['test'],
  // transform: {
  //   '\\.ts?x$': ['babel-jest', { cwd: __dirname }],
  // },
  testEnvironment: 'node',
  collectCoverage: true,
  collectCoverageFrom: ['packages/**/lib/*.js', '!packages/**/lib/plugin.js'],
  coverageThreshold: {
    global: {
      branches: 100,
      functions: 100,
      lines: 100,
      statements: 100,
    },
  },
}
