import { uniswapV3ProjectContents } from '@/contents/projects';
import { NemaContext } from '@/graphqlContext';
import { ApolloServer } from '@apollo/server';
import { expressMiddleware } from '@apollo/server/express4';
import { loadFilesSync } from '@graphql-tools/load-files';
import { mergeTypeDefs } from '@graphql-tools/merge';
import { PineconeClient } from '@pinecone-database/pinecone';
import { VectorOperationsApi } from '@pinecone-database/pinecone/dist/pinecone-generated-ts-fetch';
import { json } from 'body-parser';
import cors from 'cors';
import express from 'express';
import * as path from 'path';
import Mutation from './mutations';
import Query from './queries';
import resolvers from './resolvers';

const typesArray = loadFilesSync(path.join(__dirname, './graphql'), { extensions: ['graphql'] });

const typeDefs = mergeTypeDefs(typesArray);

const app = express();

(async () => {
  const pinecone: PineconeClient = new PineconeClient();

  const environment = process.env.PINECONE_ENVIRONMENT!;
  console.log('init pinecone : ', environment);

  await pinecone.init({
    environment,
    apiKey: process.env.PINECONE_API_KEY!,
  });

  const pineconeIndex: VectorOperationsApi = pinecone && pinecone.Index(uniswapV3ProjectContents.indexName);

  const logger = {
    log: (message: string) => console.log(message),
  };

  // Define a function that returns the context object
  const context = async (): Promise<NemaContext> => {
    return {
      pineconeIndex,
      logger,
    };
  };

  const rootValue = { Mutation, Query, ...resolvers };

  const server = new ApolloServer({ typeDefs, resolvers: rootValue, plugins: [] });

  await server.start();

  app.use('/graphql', cors<cors.CorsRequest>(), json(), expressMiddleware(server, { context }));

  app.listen({ port: 8000 }, () => console.log(`🚀 Server ready at http://localhost:8000/graphql`));
})();
