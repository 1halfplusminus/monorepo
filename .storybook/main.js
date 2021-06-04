module.exports = {
  stories: [],
  addons: ['@storybook/addon-essentials'],
  babel: async (options) => ({
    ...options,
    plugins: ['@babel/plugin-proposal-class-properties'],
  }),
  typescript: {
    reactDocgen: 'none',
  },
};
