var apolloRestSchema = require.resolve('apollo-link-rest/schema.graphql');
module.exports = {
  client: {
    service: {
      localSchemaFile: __dirname + '/schema.graphql',
    },
    includes: [apolloRestSchema, 'src/**/*.{ts,tsx,js,jsx,graphql,gql}'],
  },
};
