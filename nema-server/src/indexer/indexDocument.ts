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

export async function indexDocument(documentInfo: DocumentInfo, index: VectorOperationsApi | null) {
  try {
    if (documentInfo.type === DocumentInfoType.ARTICLE) {
      const docs: Document<PageMetadata>[] = await loadWebPage(documentInfo as WebArticleContent);
      await indexDocsInPinecone(docs, index, uniswapV3ProjectContents.namespace);
    } else if (documentInfo.type == DocumentInfoType.GITHUB) {
      const docs: Document<PageMetadata>[] = await loadGithubData(documentInfo as GithubContent);
      await indexDocsInPinecone(docs, index, uniswapV3ProjectContents.namespace);
    } else if (documentInfo.type == DocumentInfoType.GITBOOK) {
      const docs: Document<PageMetadata>[] = await loadGitbookData(documentInfo as GitbookContent);
      await indexDocsInPinecone(docs, index, uniswapV3ProjectContents.namespace);
    } else {
      throw new Error(`Unknown content type : ${documentInfo.type}`);
    }

    await prisma.documentInfo.update({
      where: { id: documentInfo.id },
      data: { indexed: true, indexedAt: new Date() },
    });
  } catch (e) {
    console.error(e);
  }
}
