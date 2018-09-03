/* eslint-disable comma-dangle, prettier/prettier */

module.exports = {
  collectCoverage: true,
  collectCoverageFrom: ['src/**/*.js'],
  coverageReporters: ['json-summary', 'lcov'],
  coverageThreshold: {
    global: {
      branches: 0,
      functions: 0,
      lines: 2.5,
      statements: 2.27
    }
  },
  testRegex: '/__tests__/.*-test\\.js$'
}
