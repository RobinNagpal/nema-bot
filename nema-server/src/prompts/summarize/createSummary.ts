import { uniswapGitbooks } from '@/contents/uniswapV3Contents';
import { indexDocument } from '@/indexer/indexDocument';
import { PineconeClient } from '@pinecone-database/pinecone';
import dotenv from 'dotenv';
dotenv.config();

let pinecone: PineconeClient | null = null;

const initPineconeClient = async () => {
  pinecone = new PineconeClient();
  await pinecone.init({
    environment: process.env.PINECONE_ENVIRONMENT!,
    apiKey: process.env.PINECONE_API_KEY!,
  });
};

export default async function createSummary() {
  // 1) Update README.md to include all the missing steps and how to test if the local
  // setup is working

  // 2) Setup pinecone
  // Read gitbook contents. Make sure gitbook contents are not having HTML or CSS.
  // Also read PDF foc and index it

  // 3) We read all the contents as string
  // 4) We chunk the string into 12-20k characters
  // 5) Write a prompt to get the summary of the chunk
  // 6) Combine all the summaries and resummarize it. This is the final summary


  // Some of  the things we need to consider
  // There is something call map reduce chain, which can make this process faster
  // Prompts needs to be created carefully.

  const index = pinecone!.Index(process.env.PINECONE_INDEX_NAME!);


  // This
  await indexDocument(uniswapGitbooks[0], index);
}

createSummary();
