import { uniswapV3ProjectContents } from '@/contents/projects';
import { indexDocument } from '@/indexer/indexDocument';
import { prisma } from '@/prisma';
import { VectorOperationsApi } from '@pinecone-database/pinecone/dist/pinecone-generated-ts-fetch';
import { DocumentInfo } from '@prisma/client';

export async function indexUnIndexedDocs(index: null | VectorOperationsApi) {
  const documentInfos: DocumentInfo[] = await prisma.documentInfo.findMany({
    where: {
      spaceId: 'uniswap',
      namespace: uniswapV3ProjectContents.namespace,
    },
  });

  for (const content of uniswapV3ProjectContents.contents) {
    let documentInfo = documentInfos.find((documentInfo: DocumentInfo) => content.id === documentInfo.id);

    if (!documentInfo?.indexed) {
      if (!documentInfo) {
        documentInfo = await prisma.documentInfo.create({
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
      if (!documentInfo) throw new Error(`Could not create documentInfo for ${content.id}`);
      await indexDocument(documentInfo, index);
    }
  }
}
