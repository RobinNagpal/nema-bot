import { ApolloServer } from '@apollo/server';
import { expressMiddleware } from '@apollo/server/express4';
import { loadFilesSync } from '@graphql-tools/load-files';
import { mergeTypeDefs } from '@graphql-tools/merge';
import { json } from 'body-parser';
import cors from 'cors';
import express from 'express';
import * as path from 'path';
import Mutation from './mutations';
import Query from './queries';
import resolvers from './resolvers';

const typesArray = loadFilesSync(path.join(__dirname, './graphql'), { extensions: ['graphql'] });

const typeDefs = mergeTypeDefs(typesArray);

const rootValue = { Mutation, Query, ...resolvers };

const app = express();


const server = new ApolloServer({  typeDefs, resolvers: rootValue, plugins: [] });


(async () => {
  await server.start();
  // server.applyMiddleware({ app });
  app.use('/graphql', cors<cors.CorsRequest>(), json(), expressMiddleware(server));

  app.listen({ port: 4000 }, () => console.log(`🚀 Server ready at http://localhost:4000/graphql`));
})();
