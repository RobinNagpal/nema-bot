import { uniswapV3ProjectContents } from '@/contents/projects';
import { indexUnIndexedDocs } from '@/indexer/indexUnIndexedDocs';
import { prisma } from '@/prisma';
import { PineconeClient } from '@pinecone-database/pinecone';
import { VectorOperationsApi } from '@pinecone-database/pinecone/dist/pinecone-generated-ts-fetch';

let pinecone: PineconeClient | null = null;
const pineconeIndex: VectorOperationsApi | null = null;

const initPineconeClient = async () => {
  pinecone = new PineconeClient();
  console.log('init pinecone');
  await pinecone.init({
    environment: process.env.PINECONE_ENVIRONMENT!,
    apiKey: process.env.PINECONE_API_KEY!,
  });
};

export async function reIndexAllData() {
  try {
    if (!pinecone) {
      await initPineconeClient();
    }

    await prisma.documentInfo.deleteMany({});

    const documentInfo = pinecone && pinecone.Index(uniswapV3ProjectContents.indexName);

    console.log('start indexing');
    await documentInfo?.delete1({ deleteAll: true });
    console.log('done deleting documents in index');
    await indexUnIndexedDocs(documentInfo);

    console.log('done indexing');
  } catch (e) {
    console.error(e);
  }
}

export default async function handler(req: any, res: any) {
  if (!process.env.PINECONE_INDEX_NAME) {
    res.status(500).json({ message: 'PINECONE_INDEX_NAME not set' });
    return;
  }

  const { query } = req;

  const { urls: urlString, limit } = query;
  await reIndexAllData();

  res.status(200).json({ message: 'Done' });
}
