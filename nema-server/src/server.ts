import { loadFilesSync } from '@graphql-tools/load-files';
import { mergeTypeDefs } from '@graphql-tools/merge';
import { makeExecutableSchema } from '@graphql-tools/schema';
import { ApolloServer } from 'apollo-server-express';
import express from 'express';
import * as path from 'path';

import Mutation from './mutations';
import Query from './queries';
import resolvers from './resolvers';


const typesArray = loadFilesSync(path.join(__dirname, './graphql'), { extensions: ['graphql'] });

const typeDefs = mergeTypeDefs(typesArray);

const rootValue = { Mutation, Query, ...resolvers };




const schema = makeExecutableSchema({ typeDefs, resolvers });

const app = express();
const server = new ApolloServer({ schema, rootValue });

(async () => {
  await server.start();
  server.applyMiddleware({ app });

  app.listen({ port: 4000 }, () =>
    console.log(`🚀 Server ready at http://localhost:4000${server.graphqlPath}`)
  );
})();
