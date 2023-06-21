import { PageMetadata } from '@/contents/projectsContents';
import { split } from '@/loaders/splitter';
import { Document as LGCDocument } from 'langchain/document';
import puppeteer, { Browser, Page } from 'puppeteer';
import fs from 'fs';

interface Comment {
  replyFullContent: string;
  author: string;
  date: string;
}

export interface DiscourseThread {
  url: string;
  postFullContent: string;
  author: string;
  date: string;
  comments: Comment[];
}

export async function autoScroll(page: Page): Promise<void> {
  await page.evaluate(async () => {
    await new Promise<void>((resolve) => {
      let totalHeight = 0;
      const distance = 100;
      const timer = setInterval(() => {
        const scrollHeight = document.body.scrollHeight;
        window.scrollBy(0, distance);
        totalHeight += distance;

        if (totalHeight >= scrollHeight - window.innerHeight) {
          clearInterval(timer);
          resolve();
        }
      }, 300);
    });
  });
}

export async function getDiscoursePageDetails(browser: Browser, url: string): Promise<DiscourseThread> {
  const page = await browser.newPage();
  await page.goto(url);
  await page.setViewport({
    width: 1200,
    height: 800,
  });

  await autoScroll(page);

  const postFullContent = (await page.$eval('.cooked', (e) => e.textContent)) as string;
  const author = (await page.$eval('.username', (e) => e.textContent)) as string;
  const date = (await page.$eval('.relative-date', (e) => e.textContent)) as string;

  const commentElements = await page.$$('.topic-post');
  const comments: Comment[] = [];

  for (const commentElement of commentElements) {
    const replyFullContent = (await commentElement.$eval('.cooked', (e) => e.textContent)) as string;
    const author = (await commentElement.$eval('.username', (e) => e.textContent)) as string;
    const date = (await commentElement.$eval('.relative-date', (e) => e.textContent)) as string;

    comments.push({ replyFullContent, author, date });
  }

  await page.close();

  return {
    url,
    postFullContent,
    author,
    date,
    comments,
  };
}

async function getHrefs(page: Page, selector: string): Promise<string[]> {
  const hrefs: string[] = [];
  let continueScrolling = true;

  while (continueScrolling) {
    const newHrefs: string[] = (await page.$$eval(selector, (anchors) => [].map.call(anchors, (a: HTMLAnchorElement) => a.href))) as string[];
    hrefs.push(...newHrefs);

    if (hrefs.length >= 15) {
      hrefs.length = 15; // cut off any extras
      continueScrolling = false;
    } else {
      await autoScroll(page);
    }
  }

  return hrefs;
}

async function getAllThreads(discourseUrl: string): Promise<DiscourseThread[]> {
  console.log('Came to getAllthreads Function');
  const browser = await puppeteer.launch({ headless: false });
  const page = await browser.newPage();
  await page.goto(discourseUrl);
  await page.setViewport({
    width: 1200,
    height: 800,
  });

  await autoScroll(page);

  const hrefs: string[] = await getHrefs(page, 'tr.topic-list-item > td.main-link > span > a');

  const allPageContents: DiscourseThread[] = [];
  for (const url of hrefs) {
    const threadDetails = await getDiscoursePageDetails(browser, url);
    console.log('Thread Details:', threadDetails);
    allPageContents.push(threadDetails);
  }

  await browser.close();

  return allPageContents;
}

async function getAllDiscourseDocs(discourseUrl: string): Promise<LGCDocument<PageMetadata>[]> {
  const allPageContents = await getAllThreads(discourseUrl);
  console.log('The Code Started ');
  const docs: LGCDocument<Omit<PageMetadata, 'chunk'>>[] = allPageContents.map(
    (threadDetails) =>
      new LGCDocument({
        pageContent: threadDetails.postFullContent,
        metadata: {
          source: threadDetails.url,
          url: threadDetails.url,
          fullContent: threadDetails.postFullContent,
          author: threadDetails.author,
          datePublished: threadDetails.date,
          comments: threadDetails.comments.map((comment) => ({
            replyFullContent: comment.replyFullContent,
            author: comment.author,
            date: comment.date,
          })),
        },
      })
  );
  return split(docs);
}

getAllDiscourseDocs('https://gov.uniswap.org/top')
  .then((result) => {
    fs.writeFileSync('output.json', JSON.stringify(result, null, 2));
  })
  .catch((error) => {
    console.error(error);
  });
