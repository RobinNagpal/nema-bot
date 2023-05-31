import { uniswapV3ProjectContents } from '@/contents/projects';
import { initPineconeClient } from '@/indexer/getPineconeIndex';
import { getVectors, indexDocsInPinecone } from '@/indexer/indexDocsInPinecone';
import { getArticleUrlsForSites } from '@/prompts/latestNews/getLatestNewsUrls';
import { getNewsContentsUsingCheerio } from '@/prompts/latestNews/getNewsContentsUsingCheerio';
import { generateSummaryOfContent } from '@/prompts/summarize/createSummary';
import { ScoredVector, Vector } from '@pinecone-database/pinecone';
import { VectorOperationsApi } from '@pinecone-database/pinecone/dist/pinecone-generated-ts-fetch';
import { Document as LGCDocument } from 'langchain/dist/document';
import { Document } from 'langchain/document';
import { OpenAIEmbeddings } from 'langchain/embeddings';
import { uuid } from 'uuidv4';

const urls = [
  'https://www.theblock.co/sitemap_tbco_index.xml', //post_type_post,post_type_chart, post_type_linked
  // "https://blockworks.co/news-sitemap-index.xml", // news-sitemap
  // 'https://www.coinbureau.com/sitemap_index.xml', //post-sitemap
  // 'https://coingape.com/sitemap_index.xml', //post-sitemap, post_tag
  // 'https://thedefiant.io/robots.txt', //post-sitemap
  // 'https://www.coindesk.com/robots.txt', // news-sitemap-index, new-sitemap-index-es
];

export interface PageMetadata {
  chunk: string;
  text: string;
  url: string;
  source: string;
}
export async function indexVectorsInPinecone(vectors: Vector[], index: VectorOperationsApi) {
  await index.upsert({
    upsertRequest: {
      namespace: 'latest-news',
      vectors,
    },
  });
}

async function findUnique() {
  const pineconeIndex = await initPineconeClient();
  const articleUrls = await getArticleUrlsForSites(urls);

  const docsToInsert: LGCDocument<PageMetadata>[] = [];
  for (const articleUrl of articleUrls) {
    const chunk = await getNewsContentsUsingCheerio(articleUrl);
    const summary = await generateSummaryOfContent(chunk);
    const articleDoc: LGCDocument<PageMetadata> = new LGCDocument<PageMetadata>({
      pageContent: summary,
      metadata: { source: articleUrl, url: articleUrl, text: summary, chunk },
    });
    docsToInsert.push(articleDoc);
  }

  const vectors = await getVectors(docsToInsert);
  await indexVectorsInPinecone(vectors, pineconeIndex);

  // Add docs in pinecone
  await indexDocsInPinecone(docsToInsert, pineconeIndex);

  const buckets: LGCDocument<PageMetadata>[][] = [];

  for (const vector of vectors) {
    const existingDoc = buckets.find((bucket) => bucket.find((doc) => doc.metadata.url === (vector?.metadata as any)?.url));

    if (existingDoc) {
      continue;
    }

    const similarArticles = await pineconeIndex.query({
      queryRequest: {
        namespace: 'latest-news',
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
