import { uniswapV3ProjectContents } from '@/contents/projects';
import { GitbookContent, GithubContent, PageMetadata, WebArticleContent } from '@/contents/projectsContents';
import { indexDocsInPinecone } from '@/indexer/indexDocsInPinecone';
import { loadGitbookData } from '@/loaders/gitbookLoader';
import { loadGithubData } from '@/loaders/githubLoader';
import { loadWebPage } from '@/loaders/webpageLoader';
import { prisma } from '@/prisma';
import { VectorOperationsApi } from '@pinecone-database/pinecone/dist/pinecone-generated-ts-fetch';
import { DocumentInfo, DocumentInfoType } from '@prisma/client';
import { Document } from 'langchain/document';

export async function indexUnIndexedDocs(index: null | VectorOperationsApi) {
  const documentInfos: DocumentInfo[] = await prisma.documentInfo.findMany({
    where: {
      spaceId: 'uniswap',
      namespace: uniswapV3ProjectContents.namespace,
    },
  });

  for (const content of uniswapV3ProjectContents.contents) {
    const documentInfo = documentInfos.find((documentInfo: DocumentInfo) => content.id === documentInfo.id);

    if (!documentInfo?.indexed) {
      if (!documentInfo) {
        await prisma.documentInfo.create({
          data: {
            id: content.id,
            indexed: false,
            name: content.name,
            url: content.url,
            namespace: uniswapV3ProjectContents.namespace,
            spaceId: 'uniswap',
            type: content.type,
            details: content.details || {},
            createdAt: new Date(),
            updatedAt: new Date(),
            indexedAt: null,
          },
        });
      }
      try {
        if (content.type === DocumentInfoType.ARTICLE) {
          const docs: Document<PageMetadata>[] = await loadWebPage(content as WebArticleContent);
          await indexDocsInPinecone(docs, index);
        } else if (content.type == DocumentInfoType.GITHUB) {
          const docs: Document<PageMetadata>[] = await loadGithubData(content as GithubContent);
          await indexDocsInPinecone(docs, index);
        } else if (content.type == DocumentInfoType.GITBOOK) {
          const docs: Document<PageMetadata>[] = await loadGitbookData(content as GitbookContent);
          await indexDocsInPinecone(docs, index);
        } else {
          throw new Error(`Unknown content type : ${content.type}`);
        }

        await prisma.documentInfo.update({ where: { id: content.id }, data: { indexed: true, indexedAt: new Date() } });
      } catch (e) {
        console.error(e);
      }
    }
  }
}
