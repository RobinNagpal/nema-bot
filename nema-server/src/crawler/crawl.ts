import { uniswapV3ProjectContents } from '@/contents/projects';
import { indexUnIndexedDocs } from '@/indexer/indexUnIndexedDocs';
import { PineconeClient } from '@pinecone-database/pinecone';
import Bottleneck from 'bottleneck';

const limiter = new Bottleneck({
  minTime: 2000,
});

let pinecone: PineconeClient | null = null;

const initPineconeClient = async () => {
  pinecone = new PineconeClient();
  console.log('init pinecone');
  await pinecone.init({
    environment: process.env.PINECONE_ENVIRONMENT!,
    apiKey: process.env.PINECONE_API_KEY!,
  });
};

type Response = {
  message: string;
};

export async function indexAllData() {
  try {
    if (!pinecone) {
      await initPineconeClient();
    }

    const index = pinecone && pinecone.Index(uniswapV3ProjectContents.indexName);

    console.log('start indexing');
    await index?.delete1({ deleteAll: true });
    console.log('done deleting documents in index');
    await indexUnIndexedDocs(index);

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
  await indexAllData();

  res.status(200).json({ message: 'Done' });
}
