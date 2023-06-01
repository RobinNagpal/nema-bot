import { getNewsContentsUsingCheerio } from '@/prompts/latestNews/getNewsContentsUsingCheerio';
import axios from 'axios';
import robotsParser from 'robots-parser';
import { parseStringPromise } from 'xml2js';

interface SitemapUrl {
  loc: string[];
  lastmod?: string[];
}

const urls = [
  'https://www.theblock.co/sitemap_tbco_index.xml', //post_type_post,post_type_chart, post_type_linked
  // "https://blockworks.co/news-sitemap-index.xml", // news-sitemap
  // 'https://www.coinbureau.com/sitemap_index.xml', //post-sitemap
  // 'https://coingape.com/sitemap_index.xml', //post-sitemap, post_tag
  // 'https://thedefiant.io/robots.txt', //post-sitemap
  // 'https://www.coindesk.com/robots.txt', // news-sitemap-index, new-sitemap-index-es
];

function includeSitemap(sitemap: SitemapUrl): boolean {
  const url = sitemap.loc[0];
  if (url.startsWith('https://www.theblock.co')) {
    return url.includes('post_type_post');
  }
  if (url.startsWith('https://blockworks.co')) {
    return url.includes('news-sitemap');
  }
  if (url.startsWith('https://www.coinbureau.com')) {
    return url.includes('post-sitemap');
  }
  if (url.startsWith('https://coingape.com')) {
    return url.includes('post-sitemap');
  }
  if (url.startsWith('https://thedefiant.io')) {
    return url.includes('post-sitemap');
  }
  if (url.startsWith('https://www.coindesk.com')) {
    return url.includes('news-sitemap-index') && !url.includes('news-sitemap-index-es');
  }
  return false;
}

function isInLast24Hours(sitemapUrl: SitemapUrl) {
  //set logic for past 24hrs
  const currentDate = new Date();
  const twentyFourHoursAgo = currentDate.getTime() - 24 * 60 * 60 * 1000;
  if (sitemapUrl.lastmod) {
    const lastmodDate = new Date(sitemapUrl.lastmod[0]);
    return lastmodDate.getTime() >= twentyFourHoursAgo;
  } else {
    return true;
  }
}

async function getParsedSitemapUrlsFromSitemap(sitemapUrl: string) {
  const response = await axios.get(sitemapUrl);
  const sitemapXml = response.data;

  if (sitemapUrl.includes('robots')) {
    const robots = robotsParser('', sitemapXml);

    const sitemapUrl = robots.getSitemaps();
    return sitemapUrl.map((url: string) => {
      return { loc: [url] };
    });
  } else {
    const parsedSitemap = await parseStringPromise(sitemapXml);
    return parsedSitemap.sitemapindex.sitemap;
  }
}

async function getSitemapUrls(sitemapUrls: string[]): Promise<string[]> {
  const allSiteMapUrls: string[] = [];
  for (const sitemapUrl of sitemapUrls) {
    try {
      //get the bunch of urls
      const parsedSitemapUrl = await getParsedSitemapUrlsFromSitemap(sitemapUrl);

      // filter the parsed array of urls to find the needed urls that have been altered in the past 24hrs
      const validSitemaps = parsedSitemapUrl
        .filter(includeSitemap)
        .filter(isInLast24Hours)
        .map((filteredUrl: SitemapUrl) => {
          return filteredUrl.loc[0];
        });

      allSiteMapUrls.push(...validSitemaps);
    } catch (error) {
      console.error('Error fetching sitemap:', error);
    }
  }
  return allSiteMapUrls;
}

async function getArticleUrls(sitemapUrl: string[]) {
  console.log('running for ' + sitemapUrl);
  //set logic for past 24hrs
  const currentDate = new Date();
  const twentyFourHoursAgo = currentDate.getTime() - 24 * 60 * 60 * 1000;
  const filteredUrls: string[] = [];

  await Promise.all(
    sitemapUrl.map(async (sitemapUrl) => {
      try {
        //get the bunch of urls
        const response = await axios.get(sitemapUrl);
        const sitemapXml = response.data;
        const parsedSitemap = await parseStringPromise(sitemapXml);
        const parsedSitemapUrl: SitemapUrl[] = parsedSitemap.urlset.url;

        // filter the parsed array of urls to find those in the past 24hrs
        const filter = parsedSitemapUrl
          ?.filter((sitemapUrl: SitemapUrl) => {
            if (sitemapUrl.lastmod) {
              const lastmodDate = new Date(sitemapUrl.lastmod[0]);
              return lastmodDate.getTime() >= twentyFourHoursAgo;
            }
          })
          .map((filteredUrl) => {
            return filteredUrl.loc[0];
          });

        filteredUrls.push(...filter);
      } catch (error) {
        console.error('Error fetching sitemap:', error);
      }
    })
  );

  return filteredUrls;
}

export async function getArticleUrlsForSites(urls: string[]) {
  const sitemapUrls: string[] = await getSitemapUrls(urls);
  console.log('sitemapUrls', JSON.stringify(sitemapUrls, null, 2));
  return await getArticleUrls(sitemapUrls);
}
async function run() {
  const sitemapUrls: string[] = await getSitemapUrls(urls);
  console.log('sitemapUrls', JSON.stringify(sitemapUrls, null, 2));
  const articleUrls = await getArticleUrls(sitemapUrls);
  console.log('articleUrls', JSON.stringify(articleUrls, null, 2));

  for (const articleUrl of articleUrls) {
    const contents = await getNewsContentsUsingCheerio(articleUrl);
    console.log('articleUrl', articleUrl);
    console.log('contents', contents);
  }
}

run();

// getSitemapUrls(urls);

// const sitemapUrls = [
//   "https://www.coinbureau.com/post-sitemap.xml",
//   "https://www.coinbureau.com/post-sitemap2.xml", //[]
//   "https://www.coindesk.com/arc/outboundfeeds/news-sitemap-index/?outputType=xml",
//   "https://thedefiant.io/sitemap/post-sitemap.xml", // []
//   "https://thedefiant.io/sitemap/post-sitemap1.xml", // []
//   "https://thedefiant.io/sitemap/post-sitemap2.xml", // []
//   "https://thedefiant.io/sitemap/post-sitemap3.xml", // []
//   "https://www.theblock.co/sitemap_tbco_post_type_post_9.xml",
//   "https://coingape.com/post-sitemap.xml",
//   "https://coingape.com/post-sitemap17.xml",
//   "https://blockworks.co/news-sitemap/1",
//   "https://blockworks.co/news-sitemap/2",
// ];

// getArticleUrls(sitemapUrls);
