import { uniswapV3ProjectContents } from '@/contents/projects';
import { GitbookContent, GithubContent, PageMetadata, WebArticleContent } from '@/contents/projectsContents';
import { loadGitbookData } from '@/loaders/gitbookLoader';
import { loadGithubData } from '@/loaders/githubLoader';
import { loadWebPage } from '@/loaders/webpageLoader';
import { prisma } from '@/prisma';
import { DocumentInfo, DocumentInfoType } from '@prisma/client';
import { Document } from 'langchain/document';

export async function getUnIndexedDocs() {
  const documents: DocumentInfo[] = await prisma.documentInfo.findMany({
    where: {
      spaceId: 'uniswap',
      namespace: uniswapV3ProjectContents.namespace,
    },
  });

  let allDocs: Document<PageMetadata>[] = [];
  for (const content of uniswapV3ProjectContents.contents) {
    let docs: Document<PageMetadata>[] = [];
    try {
      if (content.type === DocumentInfoType.ARTICLE) {
        docs = await loadWebPage(content as WebArticleContent);
      } else if (content.type == DocumentInfoType.GITHUB) {
        docs = await loadGithubData(content as GithubContent);
      } else {
        docs = await loadGitbookData(content as GitbookContent);
      }
      allDocs = allDocs.concat(docs);
    } catch (e) {
      console.error(e);
    }
  }
  return allDocs;
}
