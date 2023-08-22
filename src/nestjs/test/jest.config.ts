export default {
  ...require('../jest.config').default,
  rootDir: './',
  testRegex: '.*\\.e2e-spec\\.ts$',
  maxWorkers: 1
}