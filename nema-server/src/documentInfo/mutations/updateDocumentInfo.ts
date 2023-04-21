import { MutationUpdateDocumentInfoArgs } from '@/graphql/generated/graphql';
import { prisma } from '@/prisma';

export default function updateDocumentInfo(_: any, { id, ...args }: MutationUpdateDocumentInfoArgs) {
  return prisma.documentInfo.update({
    where: { id: id },
    data: {
      name: args.name || undefined,
      url: args.url || undefined,
      branch: args.branch || undefined,
      type: args.type || undefined,
      xpath: args.xpath || undefined,
    },
  });
}
