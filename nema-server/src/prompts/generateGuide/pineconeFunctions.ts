import { PineconeClient } from '@pinecone-database/pinecone';
import * as dotenv from 'dotenv';
import { OpenAIEmbeddings } from 'langchain/embeddings/openai';
import { PineconeStore } from 'langchain/vectorstores/pinecone';
import { Document as LGCDocument } from 'langchain/document';
import { PageMetadata } from '@/contents/projectsContents';

dotenv.config();

const client = new PineconeClient();

if (process.env.PINECONE_API_KEY && process.env.PINECONE_ENVIRONMENT && process.env.PINECONE_INDEX) {
  client.init({
    apiKey: "f31110dc-f9c9-44da-ada0-06fdcc204a8b",
    environment: "eu-west1-gcp",
  });
} else {
  console.log('set the required values in the .env file');
}

const pineconeIndex = client.Index('nema-bot');

const embeddings = new OpenAIEmbeddings({
  openAIApiKey: process.env.OPENAI_API_KEY, // In Node.js defaults to process.env.OPENAI_API_KEY
});

export async function storeLangDocs(docs: LGCDocument<PageMetadata>[]) {
  await PineconeStore.fromDocuments(docs, new OpenAIEmbeddings(), {
    pineconeIndex,
  });
}

export async function getRelevantContent(query: string) {
  const vectorStore = await PineconeStore.fromExistingIndex(new OpenAIEmbeddings(), { pineconeIndex });
  const docs = await vectorStore.similaritySearch(query);
  console.log(docs);
  return docs;
}
