import { PageMetadata } from '@/contents/projectsContents';
import { getVectors, indexDocsInPinecone } from '@/indexer/indexDocsInPinecone';
import { getIndexStats, initPineconeClient } from '@/indexer/pineconeHelper';
import { getArticleUrlsForSites } from '@/prompts/latestNews/getLatestNewsUrls';
import { getNewsContentsUsingCheerio } from '@/prompts/latestNews/getNewsContentsUsingCheerio';
import { generateSummaryOfContent } from '@/prompts/summarize/createSummary';
import { Vector } from '@pinecone-database/pinecone';
import { VectorOperationsApi } from '@pinecone-database/pinecone/dist/pinecone-generated-ts-fetch';
import { Document as LGCDocument } from 'langchain/document';

const urls = [
  'https://www.theblock.co/sitemap_tbco_index.xml', //post_type_post,post_type_chart, post_type_linked
  // "https://blockworks.co/news-sitemap-index.xml", // news-sitemap
  // 'https://www.coinbureau.com/sitemap_index.xml', //post-sitemap
  // 'https://coingape.com/sitemap_index.xml', //post-sitemap, post_tag
  // 'https://thedefiant.io/robots.txt', //post-sitemap
  // 'https://www.coindesk.com/robots.txt', // news-sitemap-index, new-sitemap-index-es
];

const LATEST_NEWS_NAMESPACE = 'latest-news';

export async function indexVectorsInPinecone(vectors: Vector[], index: VectorOperationsApi) {
  await index.upsert({
    upsertRequest: {
      namespace: LATEST_NEWS_NAMESPACE,
      vectors,
    },
  });
}

function getNewsSummary(contents: string) {
  const prompt = (news: string) => `summarize the following paragraph under 40 words in lowercase without any punctuation \n\n ${news}`;
  return generateSummaryOfContent(contents, prompt);
}

async function findUnique() {
  const pineconeIndex = await initPineconeClient();
  await pineconeIndex.delete1({
    deleteAll: true,
    namespace: LATEST_NEWS_NAMESPACE,
  });
  const articleUrls = await getArticleUrlsForSites(urls);

  const docsToInsert: LGCDocument<PageMetadata>[] = [];
  const initStats = await getIndexStats(pineconeIndex, {
    namespace: LATEST_NEWS_NAMESPACE,
  });

  console.log('initStats', initStats);

  for (const articleUrl of articleUrls) {
    const chunk = await getNewsContentsUsingCheerio(articleUrl);
    const summary = await getNewsSummary(chunk);
    console.log(`summary for ${articleUrl} :`, summary);
    const articleDoc: LGCDocument<PageMetadata> = new LGCDocument<PageMetadata>({
      pageContent: summary,
      metadata: { source: articleUrl, url: articleUrl, fullContent: summary, chunk },
    });
    docsToInsert.push(articleDoc);
  }

  const vectors = await getVectors(docsToInsert);
  await indexVectorsInPinecone(vectors, pineconeIndex);

  const stats = await getIndexStats(pineconeIndex, {
    namespace: LATEST_NEWS_NAMESPACE,
  });

  console.log('statsAfterInsert', stats);

  const buckets: LGCDocument<PageMetadata>[][] = [];

  for (const vector of vectors) {
    const existingDoc = buckets.find((bucket) => bucket.find((doc) => doc.metadata.url === (vector?.metadata as any)?.url));

    if (existingDoc) {
      continue;
    }

    const similarArticles = await pineconeIndex.query({
      queryRequest: {
        namespace: LATEST_NEWS_NAMESPACE,
        vector: vector.values,
        topK: 10,
      },
    });

    const matches = (similarArticles.matches || []).filter((match) => match.score || 0 > 0.9); // TODO: should it be 0.9?

    const bucket = matches.map((match): LGCDocument<PageMetadata> => {
      const metadata = match.metadata as PageMetadata;
      return {
        pageContent: metadata.chunk,
        metadata: { ...metadata },
      };
    });

    buckets.push(bucket);
  }
}

findUnique();
