import { PineconeClient } from '@pinecone-database/pinecone';
import * as dotenv from 'dotenv';
import { OpenAIEmbeddings } from 'langchain/embeddings/openai';
import { PineconeStore } from 'langchain/vectorstores/pinecone';
import { Document as LGCDocument } from 'langchain/document';
import { PageMetadata } from '@/contents/projectsContents';
import { initPineconeClient } from '@/indexer/pineconeHelper';
import { OpenAI } from 'langchain/llms/openai';
import { VectorDBQAChain } from 'langchain/chains';

dotenv.config();

const client = new PineconeClient();

export async function getIndex() {
  await client.init({
    apiKey: process.env.MY_PINECONE_API_KEY ?? '',
    environment: process.env.MY_PINECONE_ENVIRONMENT ?? '',
  });

  const pineconeIndex = await client.Index(process.env.MY_PINECONE_INDEX_NAME ?? 'nemabot1');
  return pineconeIndex;
}

// const embeddings = new OpenAIEmbeddings({
//   openAIApiKey: process.env.OPENAI_API_KEY, // In Node.js defaults to process.env.OPENAI_API_KEY
// });

// export async function storeLangDocs(docs: LGCDocument[]) {
//   const pineconeIndex = await getIndex();
//   await PineconeStore.fromDocuments(docs, new OpenAIEmbeddings(), {
//     pineconeIndex,namespace:"guides",
//   });
// }

export async function getRelevantContent(query: string) {
  const pineconeIndex = await getIndex();
  const vectorStore = await PineconeStore.fromExistingIndex(new OpenAIEmbeddings(), { pineconeIndex, namespace: 'guides' });
  const model = new OpenAI();
  const chain = VectorDBQAChain.fromLLM(model, vectorStore, {
    k: 1,
    returnSourceDocuments: true,
  });
  const response = await chain.call({ query: query });

  // const docs = await vectorStore.similaritySearch(query,5);
  return response;
}
