module.exports = {
  client: {
    service: {
      name: 'server',
      // optional disable SSL validation check
      skipSSLValidation: true,
      url: 'https://api.thegraph.com/subgraphs/name/uniswap/uniswap-v3',
    },
    includes: ['./libs/*.ts'],
    excludes: ['.next/*', 'node_modules/*'],
  },
};
