import axios from 'axios';
import { load } from 'cheerio';

const visited: { [key: string]: boolean } = {};
const pagesAndContent: Record<string, string> = {};

async function scrapeSite(baseSiteUrl: URL, currentUrl: URL) {
  if (Object.keys(pagesAndContent).length > 40) {
    return;
  }

  if (!currentUrl.toString().startsWith('https://docs.uniswap.org/concepts')) {
    return;
  }

  try {
    if (visited[currentUrl.toString()]) {
      return;
    }
    visited[currentUrl.toString()] = true;
    const { data } = await axios.get(currentUrl.toString());
    const $ = load(data);

    // Get the website's text content and log it
    const bodyText = $('body').text();
    pagesAndContent[currentUrl.toString()] = bodyText;
    console.log(`URL: ${currentUrl}`);
    // console.log(bodyText);

    // Then find other links on the page and scrape them too
    // Then find other links on the page and scrape them too
    const links = $('a[href]').toArray();

    for (const element of links) {
      const href = $(element).attr('href')!;
      const fullUrl = new URL(href, currentUrl);
      // Only follow links within the same domain
      if (fullUrl.origin == baseSiteUrl.origin) {
        // Wait for each page to be downloaded before moving to the next one
        await scrapeSite(baseSiteUrl, fullUrl);
      }
    }
  } catch (e) {
    console.log(e);
  }
}

async function doScaping(baseSiteUrl = 'https://docs.uniswap.org/concepts/overview') {
  await scrapeSite(new URL(baseSiteUrl), new URL(baseSiteUrl));
  console.log(JSON.stringify(Object.keys(pagesAndContent), null, 2));
}
