// jest.config.js

module.exports = {
  setupFilesAfterEnv: ['./src/setupTests.js'],
  collectCoverage: true,
  coverageReporters: ['json', 'html']
};
