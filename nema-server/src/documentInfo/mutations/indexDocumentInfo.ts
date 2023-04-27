import { MutationIndexDocumentInfoArgs } from '@/graphql/generated/graphql';
import { NemaContext } from '@/graphqlContext';
import { indexDocument } from '@/indexer/indexDocument';
import { prisma } from '@/prisma';

export default async function indexDocumentInfo(_: any, { id }: MutationIndexDocumentInfoArgs, context: NemaContext) {
  const document = await prisma.documentInfo.findUnique({ where: { id } });

  if (!document) throw new Error(`Could not find documentInfo with id ${id}`);

  await indexDocument(document, context.pineconeIndex);

  return prisma.documentInfo.update({
    where: { id: id },
    data: {
      indexed: true,
      indexedAt: new Date(),
    },
  });
}
