import { prisma } from '@/prisma';
export default function getDocumentInfos() {
  return prisma.documentInfo.findMany();
}
