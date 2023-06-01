import { uniswapV3ProjectContents } from '@/contents/projects';
import { PineconeClient } from '@pinecone-database/pinecone';
import { VectorOperationsApi } from '@pinecone-database/pinecone/dist/pinecone-generated-ts-fetch';
import dotenv from 'dotenv';

dotenv.config();

let pinecone: PineconeClient | null = null;
let pineconeIndex: VectorOperationsApi | null = null;

export const initPineconeClient = async (): Promise<VectorOperationsApi> => {
  if (pineconeIndex) return pineconeIndex;

  pinecone = new PineconeClient();
  console.log('init pinecone');
  await pinecone.init({
    environment: process.env.PINECONE_ENVIRONMENT!,
    apiKey: process.env.PINECONE_API_KEY!,
  });

  pineconeIndex = pinecone.Index(uniswapV3ProjectContents.indexName);

  return pineconeIndex;
};
