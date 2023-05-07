import { uniswapV3ProjectContents } from '@/contents/projects';
import { PageMetadata } from '@/contents/projectsContents';
import { Vector } from '@pinecone-database/pinecone';
import { VectorOperationsApi } from '@pinecone-database/pinecone/dist/pinecone-generated-ts-fetch';
import Bottleneck from 'bottleneck';
import { Document } from 'langchain/document';
import { OpenAIEmbeddings } from 'langchain/embeddings';
import { uuid } from 'uuidv4';

const limiter = new Bottleneck({
  minTime: 2000,
});

const sliceIntoChunks = (arr: Vector[], chunkSize: number) => {
  return Array.from({ length: Math.ceil(arr.length / chunkSize) }, (_, i) => arr.slice(i * chunkSize, (i + 1) * chunkSize));
};
async function getVectors(documents: Document<PageMetadata>[]): Promise<Vector[]> {
  const embedder = new OpenAIEmbeddings({
    modelName: 'text-embedding-ada-002',
  });

  //Embed the documents
  const vectors: Vector[] = await Promise.all(
    documents.flat().map(async (doc) => {
      const embedding = await embedder.embedQuery(doc.pageContent);
      console.log('done embedding', doc.metadata.url);
      return {
        id: uuid(),
        values: embedding,
        metadata: {
          chunk: doc.pageContent,
          text: doc.metadata.text as string,
          url: doc.metadata.url as string,
        },
      } as Vector;
    })
  );

  return vectors;
}

export async function indexDocsInPinecone(allDocs: Document<PageMetadata>[], index: null | VectorOperationsApi) {
  let vectors: Vector[] = [];

  try {
    vectors = (await limiter.schedule(() => getVectors(allDocs))) as unknown as Vector[];
  } catch (e) {
    console.error(e);
  }

  const chunks = sliceIntoChunks(vectors, 2);

  await Promise.all(
    chunks.map(async (chunk) => {
      if (index) {
        try {
          await index.upsert({
            upsertRequest: {
              namespace: uniswapV3ProjectContents.namespace,
              vectors: chunk as Vector[],
            },
          });
        } catch (e) {
          console.error(e);
          console.error('Error indexing chunk', chunk);
        }
      }
    })
  );
}
