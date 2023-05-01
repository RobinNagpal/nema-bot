import { MutationCreateDocumentInfoArgs } from '@/graphql/generated/graphql';
import { prisma } from '@/prisma';
import { DocumentInfoType } from '@prisma/client';
import AWS from 'aws-sdk';
import { slugify } from '@/utils/slugify';
import { splitPdf } from '../helpers/pdfSplitter';
import { indexDocument } from '@/indexer/indexDocument';
import { NemaContext } from '@/graphqlContext';

export default async function createDocumentInfo(_: any, args: MutationCreateDocumentInfoArgs, context: NemaContext) {
  const s3 = new AWS.S3({
    accessKeyId: process.env.NEMA_AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.NEMA_AWS_SECRET_ACCESS_KEY,
    region: process.env.AWS_DEFAULT_REGION,
  });

  let downloadKey = `${args.input.url}`;
  downloadKey = downloadKey.substring(`https://${process.env.NEMA_PUBLIC_AWS_S3_BUCKET}.s3.${process.env.AWS_DEFAULT_REGION}.amazonaws.com/`.length);
  console.log(`download key`, downloadKey);
  const bucket: string = process.env.NEMA_PUBLIC_AWS_S3_BUCKET!;
  const downloadParams = { Bucket: bucket, Key: downloadKey };

  const downloadResponse = await s3.getObject(downloadParams).promise();
  const pdfData = downloadResponse.Body;
  console.log(`downloaded document `);

  const uploadKey = `${args.spaceId}/user-uploads/${args.input.namespace}/${slugify(args.input.name)}`;
  console.log(`uploading to ${uploadKey}`, args);
  const uploadParams = {
    Bucket: bucket,
    Key: uploadKey,
    Body: pdfData,
    ContentType: 'application/pdf',
    ACL: 'public-read',
  };

  const uploadResponse = await s3.upload(uploadParams).promise();
  //console.log(`Upload response:`, uploadResponse);
  console.log(`Uploaded file at: ${uploadResponse.Location}`);

  const buffer = downloadResponse.Body as ArrayBuffer;

  const urls = await splitPdf(buffer, args.spaceId, args.input.namespace, args.input.name);
  console.log(`urls`, urls);

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
