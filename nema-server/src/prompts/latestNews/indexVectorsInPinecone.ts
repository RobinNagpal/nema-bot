import { LATEST_NEWS_NAMESPACE } from '@/prompts/latestNews/constants';
import { Vector } from '@pinecone-database/pinecone';
import { VectorOperationsApi } from '@pinecone-database/pinecone/dist/pinecone-generated-ts-fetch';

export async function indexVectorsInPinecone(vectors: Vector[], index: VectorOperationsApi) {
  await index.upsert({
    upsertRequest: {
      namespace: LATEST_NEWS_NAMESPACE,
      vectors,
    },
  });
}
