// https://js.langchain.com/docs/modules/indexes/vector_stores/integrations/pinecone

import { PageMetadata, WebArticleContent } from '@/contents/projectsContents';
import { split } from '@/loaders/splitter';
import * as dotenv from 'dotenv';
import { Document as LGCDocument } from 'langchain/document';
import { PuppeteerWebBaseLoader } from 'langchain/document_loaders';
import { Browser, Page } from 'puppeteer';

dotenv.config();

export async function loadWebPage(webArticleContent: WebArticleContent): Promise<LGCDocument<PageMetadata>[]> {
  const loader = new PuppeteerWebBaseLoader(webArticleContent.url, {
    gotoOptions: {
      waitUntil: 'networkidle2',
    },
    async evaluate(page: Page, browser: Browser): Promise<string> {
      const [element] = await page.$x(webArticleContent.details.xpath);
      await page.waitForXPath(webArticleContent.details.xpath);
      const contents: string = await page.evaluate((el) => el.textContent as string, element);
      console.log('contents : ', contents);
      return contents;
    },
  });
  const docs: LGCDocument<Omit<PageMetadata, 'chunk'>>[] = (await loader.load()).map((doc): LGCDocument<Omit<PageMetadata, 'chunk'>> => {
    const metadata: Omit<PageMetadata, 'chunk'> = {
      url: webArticleContent.url,
      text: doc.pageContent,
      source: webArticleContent.url,
    };
    return { ...doc, metadata };
  });

  return await split(docs);
}

export async function loadWebPages(webPages: WebArticleContent[]): Promise<LGCDocument[]> {
  let allDocs: LGCDocument[] = [];
  for (const url of webPages) {
    const output = await loadWebPage(url);

    allDocs = allDocs.concat(output);
  }
  return allDocs;
}
