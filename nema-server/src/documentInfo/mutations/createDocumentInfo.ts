import { MutationCreateDocumentInfoArgs } from "@/graphql/generated/graphql";
import { prisma } from "@/prisma";

export default function createDocumentInfo(_: any, args: any) {
  return prisma.documentInfo.create({ data: args });
}
