import { MutationUpdateDocumentInfoArgs } from '@/graphql/generated/graphql';
import { prisma } from '@/prisma';

export default function updateDocumentInfo(_: any, { id, ...args }: MutationUpdateDocumentInfoArgs) {
  return prisma.documentInfo.update({
    where: { id: id },
    data: {
      name: args.input.name,
      url: args.input.url,
      details: args.input.details,
    },
  });
}
