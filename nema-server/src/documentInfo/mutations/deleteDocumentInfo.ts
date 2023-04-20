import { MutationDeleteDocumentInfoArgs } from '@/graphql/generated/graphql';
import { prisma } from '@/prisma';

export default function deleteDocumentInfo(_: any, args: MutationDeleteDocumentInfoArgs) {
  return prisma.documentInfo.delete({ where: { id: args.id } });
}
