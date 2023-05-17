import { autoScroll } from '@/loaders/discourseLoader';
import puppeteer, { Browser } from 'puppeteer';

export async function getDiscoursePageDetails(browser: Browser, url: string) {
  const page = await browser.newPage();
  await page.goto(url);
  await page.setViewport({
    width: 1200,
    height: 800,
  });

  console.log('start scrolling');
  await autoScroll(page);
  console.log('done scrolling');

  const content = await page.content();

  await page.close();

  return content;
}

/**
 * What insights to show?
 * 1) What is the particular post about?, What was the main discussion point? any disagreements in the
 *    comments? was any decision made? relevance on some parameters?
 * 2) Solution
 *    - Read a post and call Open AI to summarize it
 *    - Read all the comments and call Open AI to summarize it
 *    - Ask Open AI with the summarized post and comments to see  if there were any disagreements
 *    - Ask Open AI with the summarized post and comments to see if there were any decisions made
 *    - All of this can be done in one request if the amount of text is not too big, else we need to do it in mutliple requests to Open AI
 *
 *
 *  3) To evaluate
 *    - Map Reduce Chain
 *    - Read about prompts how they work and how to write them
 *
 *  4) ToDo
 *  - Take three posts and create insights for them
 *
 */
export async function createDiscordInsights() {
  // Launch the browser
  const browser = await puppeteer.launch({ headless: 'new' });

  // Create a page
  const page = await browser.newPage();

  const page1Url = 'https://gov.uniswap.org/t/making-protocol-fees-operational/21198';
  const page2Url = 'https://gov.uniswap.org/t/deploy-uniswap-v3-on-ontology-evm/21224';
  const page3Url = 'https://gov.uniswap.org/t/governance-proposal-create-the-uniswap-accountability-committee/21043';

  const page1 = await getDiscoursePageDetails(browser, page1Url);

  console.log('page1 : ', page1);
}

createDiscordInsights();
