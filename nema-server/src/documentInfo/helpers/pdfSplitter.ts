import AWS from 'aws-sdk';
import { slugify } from '@/utils/slugify';
import { PDFDocument } from 'pdf-lib';

export async function splitPdf(buffer: ArrayBuffer, spaceId: string, namespace: string, fileName: string): Promise<string[]> {
  console.log(` Total bytes: ${buffer.byteLength}`);

  const pdfDoc = await PDFDocument.load(buffer);

  const splitFileUrls: string[] = [];

  for (let i = 0; i < pdfDoc.getPages().length; i++) {
    //const page = pdfDoc.getPages()[i];
    const pdfDocPage = await PDFDocument.create();
    const copiedPage = await pdfDocPage.copyPages(pdfDoc, [i]);
    pdfDocPage.addPage(copiedPage[0]);

    const url = await uploadToS3(pdfDocPage, spaceId, namespace, fileName, i);
    splitFileUrls.push(url);
  }

  return splitFileUrls;
}

async function uploadToS3(pdfDoc: PDFDocument, spaceId: string, namespace: string, fileName: string, page: number): Promise<string> {
  const s3 = new AWS.S3({
    accessKeyId: process.env.NEMA_AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.NEMA_AWS_SECRET_ACCESS_KEY,
    region: process.env.AWS_DEFAULT_REGION,
  });
  const bucket = 'nema-bot-dev-bucket';

  const objectKey = `${spaceId}/split-pdf-uploads/${namespace}/${slugify(fileName)}/${page + 1}.pdf`;

  const pdfBytes = await pdfDoc.save();

  const uploadParams = {
    Bucket: bucket,
    Key: objectKey,
    Body: pdfBytes,
    ContentType: 'application/pdf',
  };
  const uploadResponse = await s3.upload(uploadParams).promise();

  console.log(`Uploaded ${objectKey}`);

  return uploadResponse.Location;
}
