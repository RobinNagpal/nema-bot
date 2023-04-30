import { splitPdf } from '@/documentInfo/helpers/pdfSplitter';
import { MutationUpdateDocumentInfoArgs } from '@/graphql/generated/graphql';
import { NemaContext } from '@/graphqlContext';
import { indexDocument } from '@/indexer/indexDocument';
import { prisma } from '@/prisma';

export default function updateDocumentInfo(_: any, { id, ...args }: MutationUpdateDocumentInfoArgs, context: NemaContext) {
  // TODO: PDF_INDEXING - In this mutation we read the url that is passed in the request
  // 1. for that url, we first download the file, as it uploaded to a temp folder. Or the url can pass its on url of the file
  // 2. we then upload the file to s3 to a folder - `${spaceId}/user-uploads/${namespace}/${DocumentName_with_extension}`,
  // 3. We then pass the file to pdf splitter

  //const splitPdfPages = await splitPdf(downloadedFile);

  // read each page of the split pdf file and create pinecone document for each page

  //  TODO: PDF_INDEXING - First delete the old pinecone document and then create a new one
  //indexDocument(pineConeDoc, context.pineconeIndex);

  return prisma.documentInfo.update({
    where: { id: id },
    data: {
      name: args.input.name,
      url: args.input.url,
      details: args.input.details,
    },
  });
}
