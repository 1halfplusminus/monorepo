const utils = require('./src/utils');
module.exports = {
  displayName: 'swap-ui',
  preset: '../../jest.preset.js',
  transform: {
    '^.+\\.[tj]sx?$': 'babel-jest',
  },
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx'],
  coverageDirectory: '../../coverage/libs/swap-ui',
  setupFilesAfterEnv: ['./setupJest.js'],
  ...utils.jestConfig(),
};
