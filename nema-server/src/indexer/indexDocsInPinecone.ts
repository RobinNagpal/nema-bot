import { PageMetadata } from '@/contents/projectsContents';
import { getEmbeddingVectors } from '@/indexer/getEmbeddingVectors';
import { Vector } from '@pinecone-database/pinecone';
import { VectorOperationsApi } from '@pinecone-database/pinecone/dist/pinecone-generated-ts-fetch';
import Bottleneck from 'bottleneck';
import { Document } from 'langchain/document';

const limiter = new Bottleneck({
  minTime: 2000,
});

const sliceIntoChunks = (arr: Vector[], chunkSize: number) => {
  return Array.from({ length: Math.ceil(arr.length / chunkSize) }, (_, i) => arr.slice(i * chunkSize, (i + 1) * chunkSize));
};

export async function indexDocsInPinecone(allDocs: Document<PageMetadata>[], index: null | VectorOperationsApi, namespace: string) {
  let vectors: Vector[] = [];

  try {
    vectors = (await limiter.schedule(() => getEmbeddingVectors(allDocs))) as unknown as Vector[];
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
              namespace,
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
