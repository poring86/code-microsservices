export default {
  displayName: {
    name: 'nestjs',
    color: 'magentaBright'
  },
  moduleFileExtensions: [
    "js",
    "json",
    "ts"
  ],
  rootDir: "src",
  testRegex: ".*\\.spec\\.ts$",
  transform: {
    "^.+\\.(t|j)s$": "@swc/jest"
  },
  collectCoverageFrom: [
    "**/*.(t|j)s"
  ],
  coverageDirectory: "../coverage",
  testEnvironment: "node",
  setupFilesAfterEnv: [
    "../../@core/src/@seedwork/domain/tests/jest.ts",
  ],
  moduleNameMapper: {
    '@fc/micro\\-videos/(.*)$': '<rootDir>/../../../node_modules/@fc/micro-videos/dist/$1',
    "#seedwork/domain": "<rootDir>/../../../@seedwork/application/index.js",
    "#seedwork/(.*)$": ".<rootDir>/../../..@seedwork/domain/index.js",
    "#category/application": "<rootDir>/../../../category/application/index.js",
    "#category/(.*)$": "<rootDir>/../../../category/domain/index.js",
  }
}