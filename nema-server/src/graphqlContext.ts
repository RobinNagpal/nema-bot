import { VectorOperationsApi } from '@pinecone-database/pinecone/dist/pinecone-generated-ts-fetch';

export interface Logger {
  log: (message: string) => void;
}
export interface NemaContext {
  pineconeIndex: VectorOperationsApi;
  logger: Logger;
}
