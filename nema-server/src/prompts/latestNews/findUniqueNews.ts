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

export interface PageMetadata {
  chunk: string;
  text: string;
  url: string;
  source: string;
}

const thresholdSimilarity = 0.77;

const urlToSummaryMap: Map<string, string> = new Map([
  [
    'https://www.theblock.co/post/232746/cumberland-halts-filecoin-trading-citing-regulatory-environment',
    'cumberland will no longer trade filecoin with otc counterparties due to regulatory concerns, effective june 1 at 4pm utc. grayscale investments recently received a letter from the sec asking it to withdraw the registration of a trust that would invest in filecoin.',
  ],
  [
    'https://www.theblock.co/post/232750/investment-bank-cowens-digital-asset-unit-is-shutting-down',
    'cowen digital, the digital asset unit launched by investment bank cowen last year, is closing its doors. the team said they will continue to try and fulfill their goal of building a full-service platform for digital asset investing in a different home.',
  ],
  [
    'https://www.theblock.co/post/232791/hong-kong-based-first-digital-introduces-usd-stablecoin',
    'Hong Kong-based First Digital introduces USD stablecoin pegged to U.S. dollar, regulated in Asia, with reserves held in segregated accounts in Asia and programmable capabilities. Regulatory framework for digital assets in Hong Kong is becoming effective June 1.',
  ],
  [
    'https://www.theblock.co/post/232639/stablecoin-issuer-trust-reserves-team-detained-by-police-in-china-panews',
    'trust reserve team detained in china according to panews, raised $10 million in march, core team of trust reserve issued two stablecoins, kucoin ventures and circle participated in series a+ funding round, multichain core team may have been detained in china.',
  ],
  [
    'https://www.theblock.co/post/232671/tron-vulnerability-500-million-resolved',
    'tron had a critical vulnerability in its multisig accounts that put $500 million at risk, but it is now fixed according to 0d, the cybersecurity research team at dWallet Labs that found the bug and reported it to tron via their bug bounty program',
  ],
  [
    'https://www.theblock.co/post/232851/animoca-accounts-delays',
    'animoca brands is yet to produce audited financial report for 2020 due to events in 2021 and 2022, which were marked by wild exuberance in crypto markets and high-profile collapses respectively. chairman yat siu said the company is working closely with its auditor to sign off the accounts.',
  ],
  [
    'https://www.theblock.co/post/232862/ethereum-liquid-staking-protocol-rocket-pool-deploys-on-zksync-era',
    'rocket pool has deployed its ethereum liquid staking protocol on zkSync Era, allowing users to move its token rETH faster and cheaper with lower barriers to entry and transaction costs. it joins 58 projects already live on the network and is the first ethereum liquid staking protocol to deploy on the newly launched network.',
  ],
  [
    'https://www.theblock.co/post/232867/circle-says-its-launching-usdc-natively-on-arbitrum',
    'circle launches usdc natively on arbitrum, eliminating bridge withdrawal delays and providing institutional on and off-ramps. official launch is june 8, with cross-chain transfer protocol to follow. euro coin stablecoin also launched on avalanche network last month.',
  ],
]);

const LATEST_NEWS_NAMESPACE = 'latest-news';

export async function indexVectorsInPinecone(vectors: Vector[], index: VectorOperationsApi) {
  await index.upsert({
    upsertRequest: {
      namespace: LATEST_NEWS_NAMESPACE,
      vectors,
    },
  });
}

// function getNewsSummary(contents: string) {
//   const prompt = (news: string) => `summarize the following paragraph under 40 words, summary must be in lowercase without any punctuation \n\n ${news}`;
//   return generateSummaryOfContent(contents, prompt);
// }

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
    try {
      const chunk = await getNewsContentsUsingCheerio(articleUrl);
      // const summary = await getNewsSummary(chunk);
      // console.log(`summary for ${articleUrl} :`, summary);

      let summary = urlToSummaryMap.get(articleUrl);
      if (!summary) {
        summary = 'No summary available'; // Default value
      }
      // console.log(`chunk for ${articleUrl} : `, chunk);
      // console.log(`summary for ${articleUrl} :`, summary);
      const articleDoc: LGCDocument<PageMetadata> = new LGCDocument<PageMetadata>({
        pageContent: summary,
        metadata: { source: articleUrl, url: articleUrl, text: summary, chunk: chunk },
      });
      docsToInsert.push(articleDoc);
    } catch (error) {
      console.error(`Error while readying content: ${error}`);
    }
  }

  const vectors = await getVectors(docsToInsert);
  await indexVectorsInPinecone(vectors, pineconeIndex);

  const stats = await getIndexStats(pineconeIndex, {
    namespace: LATEST_NEWS_NAMESPACE,
  });

  console.log('statsAfterInsert', stats);

  const buckets: LGCDocument<PageMetadata>[][] = [];

  for (const vector of vectors) {
    try {
      let existsInBuckets = false;

      for (const bucket of buckets) {
        if (bucket.some((doc) => doc.metadata.url === (vector?.metadata as any)?.url)) {
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
      for (const bucket of buckets) {
        console.log(bucket);
      }
    } catch (error) {
      console.error(`Error while grouping similar articles: ${error}`);
    }
  }
}

findUnique();
