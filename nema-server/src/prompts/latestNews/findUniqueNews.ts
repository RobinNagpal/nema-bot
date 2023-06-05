import { PageMetadata } from '@/contents/projectsContents';
import { getEmbeddingVectors } from '@/indexer/getEmbeddingVectors';
import { getIndexStats, initPineconeClient } from '@/indexer/pineconeHelper';
import { getImportantContentUsingCheerio } from '@/prompts/generateGuide/getImportantContentUsingCheerio';
import { LATEST_NEWS_NAMESPACE } from '@/prompts/latestNews/constants';
import { getArticleUrlsForSites } from '@/prompts/latestNews/getLatestNewsUrls';
// import { indexVectorsInPinecone } from '@/prompts/latestNews/indexVectorsInPinecone';
import { getIndexedVectorsForTestNews } from '@/prompts/latestNews/testCases/testNews';
import { getIndexedVectorsForSmallerSetNews } from '@/prompts/latestNews/testCases/testSmallerSet';
import { generateSummaryOfContent } from '@/prompts/summarize/createSummary';
import { Vector } from '@pinecone-database/pinecone';
import { VectorOperationsApi } from '@pinecone-database/pinecone/dist/pinecone-generated-ts-fetch';
import { Document as LGCDocument } from 'langchain/document';
import { getIndexedVectorsForSmallerButRewriteSet } from './testCases/testSmallerButRewrites';

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

async function getAllExistingNewsVectors(pineconeIndex: VectorOperationsApi): Promise<Vector[]> {
  const result = await pineconeIndex.fetch({
    namespace: LATEST_NEWS_NAMESPACE,
    ids: [
      'e8893d03-7355-46b7-8d11-c9316edd9fbe',
      '76441483-bfd5-4d79-a366-40aedfc93db4',
      '87ca3975-1cc2-4bbb-a3e9-c4b4634ab279',
      '3cf0a57d-481d-4830-ae24-faba305e8c78',
      'e857b26a-2770-482f-b457-b9306faa4cde',
      '604a6750-62d8-46f0-8363-9dac2254ecfb',
      '9de535e2-2d4e-4def-9999-0b4f946521e4',
      'c76a428f-8e65-4e50-ba15-8638d5404cbf',
      'abc0a45d-4b65-47d6-b418-61b2dc377151',
      '614da38d-6e33-40e2-aef5-686da25efdec',
      '43fffc17-971e-4262-86f4-7dabd0d1ed0c',
      'fc8b155b-07d3-4aef-a7dc-e35964f092ed',
      '24c48c3b-0c27-4871-922b-aaeebb9120ac',
      '5245f30c-43c7-4637-997c-6184be3d3177',
      '1bd16bb1-7253-4f3f-9e7c-670903da6a72',
      '77ef7a0e-5c19-4e5a-bae6-fee5126f7319',
      'e2579519-2422-4782-ad5b-e5b958a79408',
      'a9eb489e-0295-4802-bedf-e5d15af86390',
      '2b5907bc-db39-4649-b80e-5b29f8d7b73b',
      '6807f1b6-0c90-49ea-8e9c-4ad836f4d8ce',
      '95049b05-85cb-4baf-985e-7689183727e6',
      '034f39e1-6f8d-4a07-b7fc-1bd223081a56',
      '61cae5b4-5a62-454c-9331-96be1401d739',
      '0acd770d-f81b-46fb-8944-33d66b09bd14',
      '80c15dfe-f4c6-48bd-be48-d65f36ec4673',
      '41b6e3a4-eb4e-4834-9dc8-841fdca24ef4',
      '77e59e32-e994-453c-8b6f-4595945b0225',
      '2bfbaea1-e82d-4b7b-b63a-9fc12213921b',
      '316dac3a-c339-411b-8ea3-ec1f650b4163',
      'd16994cb-e42f-4664-a926-5d8cd8666284',
      'd4c758e9-2d9e-47c8-901d-72999b20f769',
      '2ec5d11f-c69b-4cf7-b69f-bfdb3b5467c9',
      '5f655707-5158-450d-9326-051d58d39aa7',
      '7880ef20-5c37-4985-ad18-b946794d159a',
      'ad5cbc94-cca2-4f74-b639-687adf529a66',
      'ed58d803-b911-4537-aca4-7f27dde321cd',
      'ce01471b-cfe2-422b-9cb6-1f809b66bdca',
      '7eb22865-6a1b-4cad-9504-f89461067b12',
      '7d718e2e-0816-48f1-9c31-fd3d3749945c',
      '3aec21dd-f76b-4f71-bce4-b818aa9eca2d',
      'd774e1e2-31cb-47cc-a330-442ea7206e69',
      'd7fba30e-6acf-46bf-89f6-0cc6a98de00a',
      'b1980849-d8bf-4213-af8e-c5abb80a3aad',
      'e9afbc7b-84a6-4ab4-9c8a-1ef45cc199ed',
      'a058a45e-5581-4692-8487-7cb967556830',
      '91fefb67-b804-4211-89dd-82eb5b2ba88a',
      '7c9ad595-29a4-40ba-895e-d2f5e009806a',
      '2838ac74-46c1-44f3-83eb-641c8fbcda86',
      '79a4a9c2-4a57-4aa0-a8b2-d70ef985a92f',
      '9a6aafc3-9dd3-4517-ab56-ab58919f9b3a',
      '2654d706-0ee7-47bd-a87a-f2e911de537a',
      '2719b670-e641-4f6c-93ba-12e66d01a98b',
      '5b76fed9-077e-42dd-b758-f9b63f1dcbd7',
      '26d1f533-22b3-4cd2-8c75-b9a2eb242986',
      'a9dee678-1d54-4cb5-acf4-f35c56b8d06d',
      'f16faea1-978f-4429-8ee4-6cfa1cb9b377',
      'eac913b5-dbcc-4bb5-a5b4-9d1266448bbd',
      '4e76e9dc-b83e-4d68-800f-2ab2bd60dde9',
      '2e3df19b-7e89-46ac-a40c-9f1c95b0f7eb',
      '74bb69c2-20f6-42f6-bf80-ec975d47c448',
      '263be20c-83fd-4d67-b5c2-51187fbafa13',
      '7def8542-f65f-439d-9c4c-df44ebe49f8b',
      'fb2a1b5a-5aed-415e-9c05-19eecc987fa4',
      '28033d20-ee44-4f0b-8478-e72dc0a263ca',
      '1ff02422-4e0f-4e12-bd2c-3204b68fc4f6',
      '4381d5e5-1668-430e-975f-557e3990e22b',
      '8853e03f-c1ff-475e-b8c5-99921708ba59',
      '4e53c13d-6680-454f-ac34-b537953a41c6',
      '139b4b51-db46-488d-a618-d84f4dfbabe1',
      'e6ec8ff1-b708-4fa6-b0e8-1885aac4b0a3',
      '0547a0e0-b995-48ff-8b0c-3ff969514c6b',
      '0121d4a4-278c-47bd-84f3-ba75ec6de9bf',
      'bd160d51-9fa9-419a-8a78-128224680854',
      '657b013c-f578-47ea-8b71-2ad809154bad',
      '6e8bdd84-2da5-44c0-85f2-bab1348b3982',
      '2fb35007-d6a3-4879-8dfd-33f548b99e54',
      'c59bc8d8-81d2-4cec-b437-62db8d621a38',
      '03f72e1c-c566-49e7-a8f9-56eb87ae4238',
      'bb9c5317-fa25-420a-87c8-b4e85b5adca4',
      '46e631ea-7abc-4298-8b54-d56402ef37aa',
      '98aa7c8e-e9ef-4ebc-8830-03f72810ec05',
      '6f1da950-57e7-4ce1-8861-9f8a0ab6266f',
      '1e362eb3-bc16-42d9-86a2-51a86e32ac2b',
      '36f15f1c-9fdb-4002-968c-b6d84a6e130b',
      'df9047c4-4703-49c4-9b52-dc322d4dcc46',
      '3ccf8b8e-0ff3-4052-9338-0cb8c322e395',
      '496c04b8-9b13-4e45-b7fa-f16ba3d612dc',
      'f9a24b91-d184-41a7-bc61-47c4dfd09794',
      'aee88e8f-c20b-427c-bd94-3da6842866ca',
      '4950e77a-0c50-4275-937e-fa14475296ba',
      'b0150499-ae86-44e9-a890-b34fbc7f4144',
      'd7e7b57a-1631-4dd9-a6f3-8efdc360d4a3',
      'df1e6558-8cf1-444d-aa6f-effebc477393',
      '508b2b29-1ab3-4645-ae83-8154a082727f',
      '9cca23fa-d47f-47f9-8556-ba0b6571920e',
      '16d4a293-4460-4ba4-85ab-7856288d96c0',
      '87ab07ec-e442-4aa4-972f-5f8896cf1c83',
      'a398290c-e3b6-4ca4-8942-cd2ad789bc3d',
      '4b725a41-8030-4e29-b2e2-464f87bdb120',
      '4e22deab-8f54-4a9c-9fcb-aedf045e9935',
    ],
  });

  return Object.values(result.vectors || {});
}

async function getAllExistingNewsSubSetVectors(pineconeIndex: VectorOperationsApi): Promise<Vector[]> {
  const result = await pineconeIndex.fetch({
    namespace: LATEST_NEWS_NAMESPACE,
    ids: [
      '65ae276a-0338-418b-85ec-cb739ba5ab48',
      '73eb5db9-3715-41e0-b951-0765e3a3cc21',
      '042eb57c-c036-42da-bc3e-386a136efd10',
      '77148506-adcb-44bc-8469-f73151b4d7ae',
      'c481f03f-07b1-4468-8f3e-f8b3858456f7',
      'c3f067e5-d028-46e2-a9cc-8997a7f433cf',
      '35b85e52-54a5-424b-809e-dfefc68053ce',
      '266371e6-f0c8-489b-a606-4260139e3f99',
      '37f676c0-4723-4a22-8a2a-c390ea92d8ee',
      '675a04b8-e437-4b7f-b167-91f2ced08a53',
      '21a5754b-5c75-4be0-b123-d23d03b0e2e4',
      '8307f9f9-d15f-4ccb-9cd7-63d0da76e9ef',
    ],
  });

  return Object.values(result.vectors || {});
}
async function getAllExistingCuratedNewsVectors(pineconeIndex: VectorOperationsApi): Promise<Vector[]> {
  const result = await pineconeIndex.fetch({
    namespace: LATEST_NEWS_NAMESPACE,
    ids: [
      '8403df10-dbd5-46ce-834a-e9743230b026',
      '2c547aa4-b419-4a31-9daf-f35aba82a0a0',
      'eb4beb0f-3d43-4dc4-b13d-d7f1147214ea',
      '6735331c-d9d4-45bd-b9ea-71bdda4532bd',
      'a9620822-3b69-4598-8d6e-f7112783826c',
    ],
  });

  return Object.values(result.vectors || {});
}

async function getAllExistingSmallerTestNewsVectors(pineconeIndex: VectorOperationsApi): Promise<Vector[]> {
  const result = await pineconeIndex.fetch({
    namespace: LATEST_NEWS_NAMESPACE,
    ids: [
      '40ece177-eee6-421c-9614-9fc27c8fd5bf',
      '66136fc5-5055-4ab5-8388-48ddd05f5eba',
      '1e9b4376-2446-488e-b472-e598e4b1de70',
      'bbd0bd66-4589-49c6-a9c4-3fd93c82398a',
      '10cc69ea-5bf9-4c6a-8ed8-6319b80debe4',
      '7240ff21-832a-41cc-9369-55804150f53a',
      'cfed3a3f-5041-4fbf-9bfa-f684a6a46b1a',
      '2ab4988b-e4cc-488b-9a46-d1d23c0a8ed8',
      '1b1345c4-c7fd-4476-a826-22bfe42ea41e',
      '4f00c467-e0b2-411e-80c0-2df7b232e795',
      '3bb9a56a-8655-4aa5-836f-26233a962a1c',
      '1956b317-1a15-4950-ad3b-8b0f4f0d9605',
      'f166fb8a-2c69-4b4b-abf0-f802aaaf265c',
      'f679321c-2f0b-4cf8-becf-963c9788e593',
      '6b8900c7-2e23-4ffa-b185-680bff2d9af8',
    ],
  });

  return Object.values(result.vectors || {});
}

async function getAllExistingSmallerButRewrites(pineconeIndex: VectorOperationsApi): Promise<Vector[]> {
  const result = await pineconeIndex.fetch({
    namespace: LATEST_NEWS_NAMESPACE,
    ids: [
      '776ab4b2-b79a-4950-85e5-d5c8c3b0ed60',
      '93bd8134-f968-4b5d-9139-3c598e068f22',
      '0c141e72-6633-4178-825b-ff10815be2a0',
      '45ec71ab-eeba-4799-b824-6209aa3f3b9f',
      '3b28c5cb-de7f-4870-9d61-b085aa0ad81a',
      '9b9639da-608c-44f1-831e-fa573b137229',
      '23129d06-7993-4a2d-aa77-0741de0777a2',
      'd34764fe-b570-43c8-be48-d3deec8e458f',
      '7986137a-9fa7-40d5-9317-98615805983b',
      '12798b9d-5d2f-4222-91f0-66bcff9029a7',
      'e4214896-77a7-498e-85b2-31f8afb0b449',
      '35aba320-efe4-432a-a44e-242e5769cbb6',
      '60751f21-cd0f-49fa-af74-635134895b73',
      'fa672339-70b7-4cfa-aa5d-f8801874b23b',
      'd5c80429-c7ac-4adb-aa0f-2b0170c480d8',
    ],
  });

  return Object.values(result.vectors || {});
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

      const message = buckets.map((bucket) => ({ length: bucket.length, urls: bucket.map((doc) => doc.metadata) }));
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
//   await findUniquieDocsFromVectors(vectors, pineconeIndex);
// }

// the following functions are to test the unique function using different test cases
async function findUniqueTestNews() {
  const pineconeIndex = await initPineconeClient();
  await printStats(pineconeIndex);
  const vectors = await getAllExistingNewsVectors(pineconeIndex);
  await printStats(pineconeIndex);
  await findUniquieDocsFromVectors(vectors, pineconeIndex);
}
async function findUniqueTestSubSetNews() {
  const pineconeIndex = await initPineconeClient();
  await printStats(pineconeIndex);
  const vectors = await getAllExistingNewsSubSetVectors(pineconeIndex);
  await printStats(pineconeIndex);
  await findUniquieDocsFromVectors(vectors, pineconeIndex);
}

async function findUniqueTestSmallerSetNews() {
  const pineconeIndex = await initPineconeClient();
  await printStats(pineconeIndex);
  const vectors = await getAllExistingSmallerTestNewsVectors(pineconeIndex);

  await printStats(pineconeIndex);
  await findUniquieDocsFromVectors(vectors, pineconeIndex);
}

async function findUniqueTestSmallerButRewrites() {
  const pineconeIndex = await initPineconeClient();
  await printStats(pineconeIndex);
  const vectors = await getAllExistingSmallerButRewrites(pineconeIndex);

  await printStats(pineconeIndex);
  await findUniquieDocsFromVectors(vectors, pineconeIndex);
}

async function findUniqueTestCurated() {
  const pineconeIndex = await initPineconeClient();
  await printStats(pineconeIndex);
  const vectors = await getAllExistingCuratedNewsVectors(pineconeIndex);

  await printStats(pineconeIndex);
  await findUniquieDocsFromVectors(vectors, pineconeIndex);
}

findUniqueTestCurated();
