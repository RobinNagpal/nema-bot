import { MutationCreateDocumentInfoArgs } from '@/graphql/generated/graphql';
import { prisma } from '@/prisma';
import { DocumentInfoType } from '@prisma/client';

export default function createDocumentInfo(_: any, args: MutationCreateDocumentInfoArgs) {
  return prisma.documentInfo.create({ data: { ...args, type: args.type as DocumentInfoType } });
}
