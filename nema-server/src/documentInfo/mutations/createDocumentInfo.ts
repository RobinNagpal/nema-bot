import { MutationCreateDocumentInfoArgs } from '@/graphql/generated/graphql';
import { prisma } from '@/prisma';
import { DocumentInfoType } from '@prisma/client';

export default function createDocumentInfo(_: any, args: MutationCreateDocumentInfoArgs) {
  return prisma.documentInfo.create({
    data: {
      id: args.id,
      name: args.input.name,
      type: args.input.type as DocumentInfoType,
      url: args.input.url,
      namespace: args.input.namespace,
      details: args.input.details,
      spaceId: args.spaceId,
    },
  });
}
