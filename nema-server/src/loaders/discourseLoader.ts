import fs from 'fs';
import puppeteer, { Browser, Page } from 'puppeteer';

interface Comment {
  replyFullContent: string;
  author: string;
  date: string;
}

export interface DiscoursePost {
  source: string;
  url: string;
  fullContent: string;
  author: string;
  datePublished: string;
  comments: Comment[];
}

export interface DiscourseThread {
  url: string;
  postContentFull: string;
  author: string;
  date: string;
  comments: Comment[];
}

export async function autoScroll(page: Page, totalHeightLimit: number): Promise<void> {
  await page.evaluate(async (heightLimit) => {
    await new Promise<void>((resolve) => {
      let totalHeight = 0;
      const distance = 100;
      const timer = setInterval(() => {
        const scrollHeight = document.body.scrollHeight;
        window.scrollBy(0, distance);
        totalHeight += distance;

        console.log('totalHeight: ', totalHeight, 'heightLimit: ', heightLimit, 'scrollHeight: ', scrollHeight);

        if (totalHeight >= heightLimit) {
          clearInterval(timer);
          resolve();
        } else {
          if (totalHeight >= scrollHeight - window.innerHeight) {
            clearInterval(timer);
            resolve();
          }
        }
      }, 300);
    });
  }, totalHeightLimit);
}

export async function scrollAndCapture(page: Page, selector: string): Promise<any[]> {
  return await page.evaluate(async (selector) => {
    return await new Promise<any[]>((resolve) => {
      const matchingElements: any[] = [];
      let totalHeight = 0;
      const distance = 100;
      const timer = setInterval(() => {
        const scrollHeight = document.body.scrollHeight;
        window.scrollBy(0, distance);
        totalHeight += distance;

        const elements = document.querySelectorAll(selector);
        // const matchingElements.push(elements.values())
        if (totalHeight >= scrollHeight - window.innerHeight) {
          clearInterval(timer);
          resolve(matchingElements);
        }
      }, 300);
    });
  }, selector);
}

export async function getDiscoursePostWithComments(browser: Browser, url: string): Promise<DiscourseThread> {
  const page = await browser.newPage();
  await page.goto(url);
  await page.setViewport({
    width: 1200,
    height: 800,
  });

  // await autoScroll(page, 100000);

  const contentElement = await page.$('.regular.contents');
  const postContentFull = (await page.evaluate((element) => element!.textContent, contentElement)) as string;
  const mainAuthorElement = await page.$('.first.username a') ;
  const author =( mainAuthorElement ? await page.evaluate((element) => element.textContent, mainAuthorElement) : '') as string ;

  const mainDateElement =await page.$('.post-date [data-time]');
  const date = (mainDateElement ? await page.evaluate((element) => element.getAttribute('title'), mainDateElement) : '') as string;

  // Scrape comments
  const commentElements = await page.$$('.topic-post.clearfix.regular');
  const comments: Comment[] = [];

  for (let i = 1; i < commentElements.length; i++) {
    const commentElement = commentElements[i];

    const authorElement = await commentElement.$('.first.username a');
    const author = (await page.evaluate((element) => element!.textContent, authorElement)) as string;

    const dateElement = await commentElement.$('.post-date [data-time]');
    const date =( await page.evaluate((element) => element!.getAttribute('title'), dateElement)) as string;

    const contentElement = await commentElement.$('.cooked');
    const replyFullContent = (await page.evaluate((element) => element!.textContent, contentElement)) as string;

    comments.push({replyFullContent, author, date});
  }
  await page.close();

  return {
    url,
    postContentFull,
    author,
    date,
    comments,
  };
}

async function getHrefs(page: Page, selector: string): Promise<string[]> {
  return (await page.$$eval(selector, (anchors) => [].map.call(anchors, (a: HTMLAnchorElement) => a.href))) as string[];
}

async function getAllPosts(discourseUrl: string): Promise<DiscourseThread[]> {
  console.log('Came to getAllthreads Function');
  const browser = await puppeteer.launch({ headless: false });
  const page = await browser.newPage();
  await page.goto(discourseUrl);
  await page.setViewport({
    width: 1200,
    height: 800,
  });

  await autoScroll(page, 600);

  const hrefs: string[] = await getHrefs(page, 'tr.topic-list-item > td.main-link > span > a');

  const allPageContents: DiscourseThread[] = [];
  const limitedHrefs = hrefs.slice(0, 10);

  console.log('limitedHrefs: ', limitedHrefs.join('\n'));
  console.log('limitedHrefs length: ', limitedHrefs.length);

  for (const url of limitedHrefs) {
    const threadDetails = await getDiscoursePostWithComments(browser, url);
    console.log('Thread Details:', threadDetails);
    allPageContents.push(threadDetails);
  }

  await browser.close();

  return allPageContents;
}

async function getAllDiscourseDocs(discourseUrl: string): Promise<DiscoursePost[]> {
  const allPageContents = await getAllPosts(discourseUrl);
  console.log('All Page Contents Length:', allPageContents.length);
  console.log('All Page Contents URLs:', allPageContents.map((c) => c.url).join('\n'));
  console.log('The Code Started ');
  const docs: DiscoursePost[] = allPageContents.map(
    (threadDetails: DiscourseThread): DiscoursePost => ({
      source: threadDetails.url,
      url: threadDetails.url,
      fullContent: threadDetails.postContentFull,
      author: threadDetails.author,
      datePublished: threadDetails.date,
      comments: threadDetails.comments.map((comment) => ({
        replyFullContent: comment.replyFullContent,
        author: comment.author,
        date: comment.date,
      })),
    })
  );
  return docs;
}

getAllDiscourseDocs('https://gov.uniswap.org/top')
  .then((result) => {
    fs.writeFileSync('output.json', JSON.stringify(result, null, 2));
  })
  .catch((error) => {
    console.error(error);
  });
