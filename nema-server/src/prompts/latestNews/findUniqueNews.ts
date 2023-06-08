import { PageMetadata } from '@/contents/projectsContents';
import { getEmbeddingVectors } from '@/indexer/getEmbeddingVectors';
import { getIndexStats, initPineconeClient } from '@/indexer/pineconeHelper';
import { getImportantContentUsingCheerio } from '@/prompts/generateGuide/getImportantContentUsingCheerio';
import { LATEST_NEWS_NAMESPACE } from '@/prompts/latestNews/constants';
import { getArticleUrlsForSites, run } from '@/prompts/latestNews/getLatestNewsUrls';
// import { indexVectorsInPinecone } from '@/prompts/latestNews/indexVectorsInPinecone';

import { generateSummaryOfContent } from '@/prompts/summarize/createSummary';
import { Vector } from '@pinecone-database/pinecone';
import { VectorOperationsApi } from '@pinecone-database/pinecone/dist/pinecone-generated-ts-fetch';
import { Document as LGCDocument } from 'langchain/document';
import { writeNews } from './createNews';
import { bucket1, bucket2 } from './testCases/bucketsForNewsCreation';
import { getAllExistingCuratedNewsVectors, getAllExistingNewsSubSetVectors, getAllExistingNewsVectors } from './testCases/testNews';
import { getAllExistingSmallerTestNewsVectors } from './testCases/testSmallerSet';
import { getAllExistingSmallerButRewrites } from './testCases/testSmallerButRewrites';

const urls = [
  // 'https://www.theblock.co/sitemap_tbco_index.xml', //post_type_post,post_type_chart, post_type_linked
  // 'https://blockworks.co/news-sitemap-index.xml', // news-sitemap
  // 'https://www.coinbureau.com/sitemap_index.xml', //post-sitemap
  // 'https://coingape.com/sitemap_index.xml', //post-sitemap, post_tag
  'https://thedefiant.io/robots.txt', //post-sitemap
  'https://www.coindesk.com/robots.txt', // news-sitemap-index, new-sitemap-index-es
];

const thresholdSimilarity = 0.85;

export async function indexVectorsInPinecone(vectors: Vector[], index: VectorOperationsApi) {
  await index.upsert({
    upsertRequest: {
      namespace: LATEST_NEWS_NAMESPACE,
      vectors,
    },
  });
}

async function getNewsSummary(contents: string): Promise<string> {
  const prompt = (news: string) => `summarize the following paragraph under 150 words, summary must be in lowercase without any punctuation \n\n ${news}`;
  const contentSummary = await generateSummaryOfContent(contents, prompt);
  // console.log(`contentSummary \n\n ${contentSummary} \n\n`);
  return contentSummary;
}

async function getLatestNewsDocs(): Promise<LGCDocument<PageMetadata>[]> {
  const docsToInsert: LGCDocument<PageMetadata>[] = [];
  const articleUrls = await getArticleUrlsForSites(urls);

  for (const articleUrl of articleUrls) {
    try {
      const chunk = await getImportantContentUsingCheerio(articleUrl);
      const summary = await getNewsSummary(chunk);
      const articleDoc: LGCDocument<PageMetadata> = new LGCDocument<PageMetadata>({
        pageContent: summary,
        metadata: { source: articleUrl, url: articleUrl, fullContent: summary, chunk: chunk },
      });
      docsToInsert.push(articleDoc);
    } catch (error) {
      console.error(`Error while readying content: ${error}`);
    }
  }
  return docsToInsert;
}

async function cleanUpPineconeNews(pineconeIndex: VectorOperationsApi) {
  await pineconeIndex.delete1({
    deleteAll: true,
    namespace: LATEST_NEWS_NAMESPACE,
  });
}

async function printStats(pineconeIndex: VectorOperationsApi) {
  const initStats = await getIndexStats(pineconeIndex, {
    namespace: LATEST_NEWS_NAMESPACE,
  });

  console.log('Stats', initStats);
}

// async function getIndexedVectorsForNews(pineconeIndex: VectorOperationsApi) {
//   const docsToInsert = await getLatestNewsDocs();

//   const vectors = await getVectors(docsToInsert);

//   await indexVectorsInPinecone(vectors, pineconeIndex);
//   return vectors;
// }

function existsInBuckets(vector: any, buckets: LGCDocument<PageMetadata>[][]): boolean {
  let exists = false;

  for (const bucket of buckets) {
    bucket.map((doc) => {
      if (doc.metadata.url === vector?.metadata?.url) {
        exists = true;
        return;
      } else {
        exists = false;
      }
    });
  }

  return exists;
}

async function findUniqueDocsFromVectors(vectors: Vector[], pineconeIndex: VectorOperationsApi) {
  const buckets: LGCDocument<PageMetadata>[][] = [];

  for (const vector of vectors) {
    try {
      let existsInBuckets = false;

      for (const bucket of buckets) {
        const metadata = vector.metadata as PageMetadata;
        if (bucket.some((doc) => doc.metadata.url === metadata.url)) {
          existsInBuckets = true;
          break; // Exit the inner loop if the vector is found in any bucket
        }
      }

      if (existsInBuckets) {
        continue; // Skip to the next vector if the vector exists in any bucket
      }
      const similarArticles = await pineconeIndex.query({
        queryRequest: {
          namespace: LATEST_NEWS_NAMESPACE,
          vector: vector.values,
          topK: 10,
          includeMetadata: true,
        },
      });

      similarArticles.matches?.map((match) => {
        console.log('score: ', match.score);
        console.log('metadata: ', match.metadata);
      });
      // console.log(similarArticles);

      const matches = (similarArticles.matches || []).filter((match) => {
        return (match.score || 0) > thresholdSimilarity;
      }); // TODO: should it be 0.9?

      const bucket = matches.map((match): LGCDocument<PageMetadata> => {
        const metadata = match.metadata as PageMetadata;
        return {
          pageContent: metadata.chunk,
          metadata: { ...metadata },
        };
      });

      buckets.push(bucket);

      const message = buckets.map((bucket) => ({ length: bucket.length, urls: bucket.map((doc) => doc) }));
      console.log(JSON.stringify(message, null, 2));
    } catch (error) {
      console.error(`Error while grouping similar articles: ${error}`);
    }
  }
  console.log(buckets);
}

// async function findUniqueNews() {
//   const pineconeIndex = await initPineconeClient();
//   const vectors = await getIndexedVectorsForNews(pineconeIndex);
//   await findUniqueDocsFromVectors(vectors, pineconeIndex);
// }

// the following functions are to test the unique function using different test cases
async function findUniqueTestNews() {
  const pineconeIndex = await initPineconeClient();
  await printStats(pineconeIndex);
  const vectors = await getAllExistingNewsVectors(pineconeIndex);
  await printStats(pineconeIndex);
  await findUniqueDocsFromVectors(vectors, pineconeIndex);
}
async function findUniqueTestSubSetNews() {
  const pineconeIndex = await initPineconeClient();
  await printStats(pineconeIndex);
  const vectors = await getAllExistingNewsSubSetVectors(pineconeIndex);
  await printStats(pineconeIndex);
  await findUniqueDocsFromVectors(vectors, pineconeIndex);
}

async function findUniqueTestSmallerSetNews() {
  const pineconeIndex = await initPineconeClient();
  await printStats(pineconeIndex);
  const vectors = await getAllExistingSmallerTestNewsVectors(pineconeIndex);

  await printStats(pineconeIndex);
  await findUniqueDocsFromVectors(vectors, pineconeIndex);
}

async function findUniqueTestSmallerButRewrites() {
  const pineconeIndex = await initPineconeClient();
  await printStats(pineconeIndex);
  const vectors = await getAllExistingSmallerButRewrites(pineconeIndex);

  await printStats(pineconeIndex);
  await findUniqueDocsFromVectors(vectors, pineconeIndex);
}

async function findUniqueTestCurated() {
  const pineconeIndex = await initPineconeClient();
  await printStats(pineconeIndex);
  const vectors = await getAllExistingCuratedNewsVectors(pineconeIndex);

  await printStats(pineconeIndex);
  await findUniqueDocsFromVectors(vectors, pineconeIndex);
}

// To test news creation
// writeNews(bucket1);
// writeNews(bucket2);
