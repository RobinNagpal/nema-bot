import { QueryDocumentInfoArgs } from '@/graphql/generated/graphql';
import { prisma } from '@/prisma';

export default function getDocumentInfo(_: any, args: QueryDocumentInfoArgs) {
  return prisma.documentInfo.findUnique({ where: { id: args.id } });

}
