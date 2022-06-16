


const { pathsToModuleNameMapper } = require("ts-jest");

const { compilerOptions } = require("./tsconfig.json");

module.exports = {
  bail: true,
  clearMocks: true,
  testEnvironment: "node",
  moduleNameMapper: pathsToModuleNameMapper(compilerOptions.paths, {
    prefix: "<rootDir>/src",
  }),
  preset: "ts-jest",
  testMatch: ["**/*.spec.ts"],
  collectCoverage: false,
  collectCoverageFrom: ["<rootDir>/src/modules/**/useCases/**/*.ts"],
  coverageProvider: "v8",
  coverageReporters: ["text-summary", "lcov"],

};
