import { getConsolidatedCode } from '@/prompts/code/getConsolidatedCode';
import { getMatchingFullDocs, getMetadataOfMatchingDocs } from '@/prompts/code/getMatchingFullDocs';
import { getRelevantCode } from '@/prompts/code/getRelevantCode';
import { templates } from '@/templates';
import { PineconeClient } from '@pinecone-database/pinecone';
import dotenv from 'dotenv';
import { ChatOpenAI } from 'langchain/chat_models';
import { OpenAIEmbeddings } from 'langchain/embeddings/openai';
import { OpenAI } from 'langchain/llms/openai';
import { PromptTemplate } from 'langchain/prompts';

dotenv.config();

let pinecone: PineconeClient | null = null;

const initPineconeClient = async () => {
  pinecone = new PineconeClient();
  await pinecone.init({
    environment: process.env.PINECONE_ENVIRONMENT!,
    apiKey: process.env.PINECONE_API_KEY!,
  });
};

function chunkString(doc: string, chunkSize: number): string[] {
  let index = 0;
  const chunks: string[] = [];

  while (index < doc.length) {
    chunks.push(doc.substr(index, chunkSize));
    index += chunkSize;
  }

  return chunks;
}

// Usage

const handleRequest = async () => {
  if (!pinecone) {
    await initPineconeClient();
  }

  try {
    const prompt = 'Explain the swapping in uniswap v3 pool smart contract and write couple of test cases for it.';

    // Embed the user's intent and query the Pinecone index
    const embedder = new OpenAIEmbeddings({ openAIApiKey: process.env.OPENAI_API_KEY });

    const inquiryEmbeddings = await embedder.embedQuery(prompt);

    // Step 1: Get the top 5 matches from the Pinecone index
    const fullDocuments = await getMetadataOfMatchingDocs(pinecone!, inquiryEmbeddings);

    for (const doc of fullDocuments) {
      const chunks = chunkString(doc.text, 12000);
      for (const chunk of chunks) {
        console.log('================ Call to get relevant code ==================================');
        const relevantCode = await getRelevantCode(prompt, chunk);
        console.log('==================================================');
        console.log('relevantCode', relevantCode);
        console.log('==================================================');
      }
    }
    // const result = await getConsolidatedCode(prompt, fullDocuments.join('\n'));
    // console.log('result', result);
  } catch (error) {
    console.error(error);
  }
};

handleRequest();
