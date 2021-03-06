/** @type {import('ts-jest/dist/types').InitialOptionsTsJest} */
module.exports = {
  projects: [
    '<rootDir>/libs/ui',
    '<rootDir>/libs/covid',
    '<rootDir>/libs/typescript/utils',
    '<rootDir>/libs/covid-disease.sh',
    '<rootDir>/libs/covid-diseasesh',
    '<rootDir>/apps/covid-dashboard',
    '<rootDir>/apps/piano-app',
    '<rootDir>/libs/hardhat-utils',
    '<rootDir>/libs/swap-ui',
    '<rootDir>/apps/redcross-swap',
    '<rootDir>/libs/swap-lib',
  ],
  transformIgnorePatterns: [
    '/node_modules/(?!antd|@ant-design|rc-.+?|@babel/runtime).+(js|jsx)$',
  ],
};
