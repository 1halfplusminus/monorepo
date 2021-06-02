const utils = require('@halfoneplusminus/swap-ui/utils');
module.exports = {
  displayName: 'redcross-swap',
  preset: '../../jest.preset.js',
  transform: {
    '^(?!.*\\.(js|jsx|ts|tsx|css|json)$)': '@nrwl/react/plugins/jest',
    '^.+\\.[tj]sx?$': 'babel-jest',
  },
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx'],
  coverageDirectory: '../../coverage/apps/redcross-swap',
  ...utils.jestConfig(),
};