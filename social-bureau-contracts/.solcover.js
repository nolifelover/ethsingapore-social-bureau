module.exports = {
  istanbulReporter: ['html', 'lcov', 'text'],
  skipFiles: [
    'mocks',
    'tests',
    'shared/abstracts',
    'shared/interfaces',
    'shared/libraries',
    'shared/test',
    'shared/token/Old',
  ],
  mocha: {
    fgrep: '[skip-on-coverage]',
    invert: true,
  },
  configureYulOptimizer: true,
};
