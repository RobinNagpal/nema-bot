import { presignedUrlCreator } from '@/documentInfo/helpers/getPresignedUrl';
import { splitPdf } from '@/documentInfo/helpers/pdfSplitter';
import { MutationCreateSignedUrlArgs } from '@/graphql/generated/graphql';
import { NemaContext } from '@/graphqlContext';
import { indexDocument } from '@/indexer/indexDocument';

export default async function createSignedUrl(_: any, args: MutationCreateSignedUrlArgs, context: NemaContext) {
  // TODO: PDF_INDEXING - In this mutation we read the url that is passed in the request
  // 1. for that url, we first download the file, as it uploaded to a temp folder. Or the url can pass its on url of the file
  // 2. we then upload the file to s3 to a folder - `${spaceId}/user-uploads/${namespace}/${DocumentName_with_extension}`,
  // 3. We then pass the file to pdf splitter

  const splitPdfPages = await splitPdf(downloadedFile);

  // read each page of the split pdf file and create pinecone document for each page

  indexDocument(pineConeDoc, context.pineconeIndex);

  return await presignedUrlCreator.createSignedUrl(args.spaceId, args.namespace, args.input);
}
