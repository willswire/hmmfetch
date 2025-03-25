module.exports = {
  testEnvironment: 'node',
  moduleFileExtensions: ['js'],
  testMatch: ['**/*.test.js'],
  verbose: true,
  collectCoverage: true,
  coverageDirectory: './coverage',
  coverageReporters: ['text', 'lcov'],
};