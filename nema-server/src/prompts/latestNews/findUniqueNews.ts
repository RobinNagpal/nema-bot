import { PageMetadata } from '@/contents/projectsContents';
import { getVectors, indexDocsInPinecone } from '@/indexer/indexDocsInPinecone';
import { getIndexStats, initPineconeClient } from '@/indexer/pineconeHelper';
import { getImportantContentUsingCheerio } from '@/prompts/generateGuide/getImportantContentUsingCheerio';
import { getArticleUrlsForSites } from '@/prompts/latestNews/getLatestNewsUrls';
import { getNewsContentsUsingCheerio } from '@/prompts/latestNews/getNewsContentsUsingCheerio';
import { getTestNewsDocs } from '@/prompts/latestNews/testNews';
import { generateSummaryOfContent } from '@/prompts/summarize/createSummary';
import { ScoredVector, Vector } from '@pinecone-database/pinecone';
import { VectorOperationsApi } from '@pinecone-database/pinecone/dist/pinecone-generated-ts-fetch';
import { Document as LGCDocument } from 'langchain/document';

const urls = [
  // 'https://www.theblock.co/sitemap_tbco_index.xml', //post_type_post,post_type_chart, post_type_linked
  // 'https://blockworks.co/news-sitemap-index.xml', // news-sitemap
  // 'https://www.coinbureau.com/sitemap_index.xml', //post-sitemap
  // 'https://coingape.com/sitemap_index.xml', //post-sitemap, post_tag
  'https://thedefiant.io/robots.txt', //post-sitemap
  'https://www.coindesk.com/robots.txt', // news-sitemap-index, new-sitemap-index-es
];

const thresholdSimilarity = 0.77;

const LATEST_NEWS_NAMESPACE = 'latest-news';

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

async function getAllExistingNewsVectors(pineconeIndex: VectorOperationsApi): Promise<Vector[]> {
  const result = await pineconeIndex.fetch({
    namespace: LATEST_NEWS_NAMESPACE,
    ids: [
      '9216b705-2055-414d-a644-3309ca7e6c00',
      'c48c07e5-9f77-421c-96a0-795d7811a097',
      '70371636-1e38-4cd5-8b61-b0abbee15c05',
      '11856b30-9255-4d5d-8984-39551e5f8279',
      'cbf5ca1c-7184-4f06-83b4-6b272e3f1dd0',
      '82c00865-18ad-4805-97ef-f4d402371577',
      'e19ed082-0186-45d5-96af-b2411577e220',
      '3974a6a4-afb6-489a-b78a-0241ef8aab70',
      '933de847-8266-4fab-ba1b-d15380f6c3af',
      'e1786d9f-9616-4cfe-88a0-9d94134e6922',
      '9d9bbb5d-1f86-48d3-9fd8-0e2896aea901',
      'e5971401-5844-48f3-b2b2-6a37ddd9ceee',
      '36a2ff90-0bec-42b5-b0b2-6b89b50f17a3',
      '47dfb352-0063-427b-aea9-272fc02c586b',
      '5be2d28d-f0f3-415b-bffd-2288d39f568a',
      // 'd0421c5b-6c64-4e08-b8f9-1d6d1467823a',
      // '4f7eaa8b-b13f-45bd-bec3-d3c55af2e76a',
      // '5e74ae8b-bd3b-42be-ab35-d849756974eb',
      // 'c09b5f3c-d69f-478e-8535-6835a5103573',
      // 'eff760a3-7efc-473a-8758-a555cc6ee8c0',
      // '5f90d7f2-c1e0-49de-a52b-769bc493fa7a',
      // 'd808ec4b-fdab-4db3-be51-8160fcb6e027',
      // '83e5f79b-9897-42f9-8682-57cbe8f63921',
      // '76dce00b-8c1f-4c9f-aefd-a61566d9d3be',
      // 'b03be232-0448-45fb-85b3-ced1ff55648d',
      // '11e006d3-beb7-4953-ab81-427a37e8848c',
      // '46b99e21-8404-46d5-83ec-c1d62e4b475d',
      // 'a815c332-0c50-4a93-b8be-d9340587761f',
      // '6650cb41-55c6-4fb9-8e8e-0ca6187266e1',
      // 'bb8fcc58-a040-4244-a277-186d27ba8ea9',
      // 'ae4e38ab-0d3d-467f-b7bf-a8c851870276',
      // '6076f0b5-c26b-4e6b-9cc5-b62848510374',
      // '58141540-69c2-428d-a8f5-5c7150268a53',
      // '3f29904b-5e58-4d28-84f5-8b80b15552d9',
      // '48cfe6f7-32a3-4b6e-8cc5-3773e5dd05f7',
      // '4ba2cabe-bf52-433d-9b70-f37373a8115e',
      // 'd25ef360-1e65-4d6a-b567-f99c6e285793',
      // '23b43ebb-722d-4ee8-9d2d-f66c85eb6cf9',
      // '2704f9d9-9542-4e48-b6f9-bf81b2f797fd',
      // '8f8eb0fb-ccf4-4aa4-9e0b-cec808b39ee7',
      // 'fbcf59b1-214c-4843-8f84-29dff505042a',
      // '871b0503-0a09-4269-9721-ad2c1a4688ed',
      // 'a0cf7045-0967-418b-a53a-b15a16fb224c',
      // '309f91ff-6aa6-4bb6-bb04-ce48436883ee',
      // '5f42118d-0200-4d17-8e8b-1b9a599b41cf',
      // '9659ec7b-682f-407c-a8e2-99bf3c4152c8',
      // '7d568696-1abb-4ce2-a69d-96e170a1832c',
      // 'd23a79de-fdae-4b33-befb-a25c8ac7f1a3',
      // '7f4f3299-c2d7-4e42-a2b7-ae6bb6d10b9c',
      // '4aeacb02-688f-434b-a88e-98a50377aea5',
      // 'd7821e19-23f1-425e-9bf1-9cf60b2c9336',
      // 'cace4e82-6be5-4a89-abd9-a37d51e87b3d',
      // '24a36d6f-fb1f-4b5f-acc6-8467fd662e61',
      // '65220fc0-3f5d-45ac-a067-ebfc30128baa',
      // 'ed88a7e5-a280-4fba-860d-cbf7a49d0086',
      // '0ad31cd6-20f8-4e05-8eb9-a1f2c1bd2cc8',
      // '7d2c34ed-517f-493a-b8cd-0f4fb4f9c118',
      // '3c18fd76-2de5-4943-8a7b-5edb78c08c4b',
      // '9f7551e4-063b-42bf-9cbe-0a0d42bef2a1',
      // '6d66a7e1-f5dd-4e61-a21e-1819dc96ead2',
      // '210c0737-d5f3-487d-96ec-0dde4de1804c',
      // '16576833-a3a8-4752-8050-ec1ae05d96cd',
      // '7def97de-20e3-4b30-a669-96ccc3961764',
      // '4ed7f876-6f88-4823-8bcd-dac233ccc214',
      // 'b0471488-7579-4f60-890a-81dec08ebf17',
      // 'b8db9efc-5007-4c98-a0e1-dd4f4456e865',
      // 'db842dfd-a151-408d-9e14-83f8e798d6d8',
      // '1f25fba0-22c5-47b0-8d4f-28d49447f32b',
      // '7b24ea34-6448-4e99-92dd-2869b5c84c84',
      // 'b3ccd1bb-14c0-4c6a-9ea2-5d0e955ce260',
      // '775f4f21-fa27-4e1c-a87b-6859234b55a6',
      // '351f013f-236c-4fb8-90c4-12176d97a91a',
      // 'a8b20e0a-90fa-4ae2-a590-68e29498872a',
      // 'da028fc8-b6dd-42e2-8136-6e80f2feb877',
      // 'c4494816-7aa6-4dd2-9dae-0fd6b4b30304',
      // '30160029-e088-4546-950f-c5ef4a44ce18',
      // '228753f1-b7fc-4254-ba2d-4a2ab5d90d18',
      // '1da783ef-29a4-47c9-b62c-e05355c58d56',
      // '227bf6cc-55ea-46d9-a5f4-431ec68c0b56',
      // '5ad78272-958e-4a1a-9e12-90ec12b83192',
      // '99e61c4b-99e1-472e-b27c-dd7a81a6a3e5',
      // 'ff6fa28b-6b2b-4d03-b323-74a2cb7e7856',
      // '9b8497c9-b473-4fc4-8c92-cc79c2321c34',
      // '2e10a0cb-dfdc-430e-b917-53b59b39cc21',
      // '18cadd4f-b267-4341-a366-67da33526e7a',
      // '33bef382-f6cd-401b-8a8e-e36637e60d81',
      // 'cc013275-8cbc-4f66-ba2b-d851d0a4c66d',
      // '5fb5d79e-8185-4b3f-a571-8b3d21dfc438',
      // '22daada3-814c-4234-9c1b-37184bfd4dd9',
      // '135df41d-2db3-471f-8b7c-03373c9f3553',
      // '94111524-3150-4e4b-9a19-ea6d8150b2e4',
      // '52fb41bc-3799-455b-993b-a368a6d15a82',
      // '1de12073-0d5c-45da-a4b0-1ada54a4babd',
      // 'e9461cca-4437-430c-9146-e3928a6d1ca5',
      // '44bd2b9e-ba1c-4e9a-bae9-1b960c6e2aec',
      // 'b8a1c1d9-34c3-4ba7-b4c4-4ceca5ed6f61',
      // 'b5afacff-3ca5-42ca-97f8-8fe02548eb93',
      // '4100b3ee-db7e-4ec4-b8b9-10fa2e8696d9',
      // '51ebd16d-0392-4c2e-8044-bdf90cf78c8d',
      // '16f53045-9e84-4cbb-8ff1-17b2537287f4',
      // 'c09ebf67-cd1d-419d-ac18-34f016290f0d',
      // '29baf699-f1ef-4ea8-8722-a4b50b69202a',
      // 'f3e2279f-87ef-4bc4-a3e6-a97e8aae8343',
      // 'b5a6196c-2090-42b1-af85-0365d860b83e',
      // 'ef77b2e7-347c-4d2f-a22d-4d26ec90b84c',
      // '7b6fae0c-d033-4e46-8460-a2a176d66742',
      // 'b2858b48-daff-4434-87b3-b3b2d3b738a2',
      // '195632ad-b568-473a-bf4f-cb1dfd126fdd',
      // 'b57f8543-78d2-423a-b341-01e05061517d',
      // '9d1c2478-0519-4346-8bb3-cc301e55ed6e',
      // 'a12bf7dd-cf54-4f99-8d8e-74745045fe9b',
      // '68d207ca-271c-46aa-89d3-0637ab7ff6ae',
      // '0dafcffc-f74a-4045-967d-2df7de04ce92',
    ],
  });

  return Object.values(result.vectors || {});
}

async function getIndexedVectorsForNews(pineconeIndex: VectorOperationsApi) {
  const docsToInsert = await getLatestNewsDocs();

  const vectors = await getVectors(docsToInsert);

  await indexVectorsInPinecone(vectors, pineconeIndex);
  return vectors;
}

async function getIndexedVectorsForTestNews(pineconeIndex: VectorOperationsApi) {
  const docsToInsert = await getTestNewsDocs();

  const nonEmptyDocs = docsToInsert.filter((doc) => doc.pageContent.length > 5);

  const vectors = await getVectors(nonEmptyDocs);

  await indexVectorsInPinecone(vectors, pineconeIndex);
  return vectors;
}

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

async function findUniquieDocsFromVectors(vectors: Vector[], pineconeIndex: VectorOperationsApi) {
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
    } catch (error) {
      console.error(`Error while grouping similar articles: ${error}`);
    }
  }
}

async function findUniqueNews() {
  const pineconeIndex = await initPineconeClient();
  const vectors = await getIndexedVectorsForNews(pineconeIndex);
  await findUniquieDocsFromVectors(vectors, pineconeIndex);
}

async function findUniqueTestNews() {
  const pineconeIndex = await initPineconeClient();
  // await cleanUpPineconeNews(pineconeIndex);
  await printStats(pineconeIndex);
  // const vectors = await getIndexedVectorsForTestNews(pineconeIndex);
  const vectors = await getAllExistingNewsVectors(pineconeIndex);

  await printStats(pineconeIndex);
  await findUniquieDocsFromVectors(vectors, pineconeIndex);
}

findUniqueTestNews();
