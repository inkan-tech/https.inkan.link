module.exports = {
  testEnvironment: 'jsdom',
  setupFilesAfterEnv: ['<rootDir>/jest.setup.js'],
  transform: {
    '^.+\\.js$': 'babel-jest',
  },
  moduleNameMapper: {
    '\\.(jpg|jpeg|png|gif|eot|otf|webp|svg|ttf|woff|woff2|mp4|webm|wav|mp3|m4a|aac|oga)$':
      '<rootDir>/__mocks__/fileMock.js',
    '\\.(css|less|scss|sass)$': '<rootDir>/__mocks__/styleMock.js',
  },
  testPathIgnorePatterns: ['/node_modules/', '/public/'],
  collectCoverage: true,
  collectCoverageFrom: [
    'assets/js/**/*.js',
    '!**/node_modules/**',
    '!**/vendor/**',
  ],
  coverageReporters: ['text', 'lcov'],
};
