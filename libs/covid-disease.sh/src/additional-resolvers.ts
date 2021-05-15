// import { Resolvers } from './generated/mesh';
// import { getSdk } from './generated/sdk';
// import { findAndParseConfig } from '@graphql-mesh/config';
// import { getMesh } from '@graphql-mesh/runtime';

// import { Covid19JhucsseService } from './generated/services/Covid19JhucsseService';

// export const resolvers: Resolvers = {
//   Query: {
//     getV3Covid19Historical: async (root, args, context, _) => {
//       console.log(args);
//       const meshConfig = await findAndParseConfig();
//       const { sdkRequester } = await getMesh(meshConfig);
//       // Get fully-typed SDK using the Mesh client and based on your GraphQL operations
//       const sdk = getSdk(sdkRequester);

//       // Execute `myQuery` and get a type-safe result
//       // Variables and result are typed: { getSomething: { fieldA: string, fieldB: number }, errors?: GraphQLError[] }
//       const result = await Covid19JhucsseService.getCovid19JhucsseService3();

//       console.log(result[0].timeline.cases.map((v, key) =>));

//       return result;
//     },
//   },
// };
