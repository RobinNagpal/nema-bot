import { PDFContent, PageMetadata } from '@/contents/projectsContents';
import { split } from '@/loaders/splitter';
import * as dotenv from 'dotenv';
import { Document as LGCDocument } from 'langchain/document';
import * as pdfjsLib from 'pdfjs-dist/legacy/build/pdf';
import AWS from 'aws-sdk';

dotenv.config();

const s3 = new AWS.S3({
  accessKeyId: process.env.NEMA_AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.NEMA_AWS_SECRET_ACCESS_KEY,
  region: process.env.AWS_DEFAULT_REGION,
});

export async function loadPDFData(pdfContent: PDFContent): Promise<LGCDocument<PageMetadata>[]> {
  const downloadKey = pdfContent.url.replace(`https://${process.env.NEMA_PUBLIC_AWS_S3_BUCKET}.s3.${process.env.AWS_DEFAULT_REGION}.amazonaws.com/`, '');
  const bucket = process.env.NEMA_PUBLIC_AWS_S3_BUCKET!;
  const downloadParams = { Bucket: bucket, Key: downloadKey };
  const downloadResponse = await s3.getObject(downloadParams).promise();
  console.log(`PDF downloaded from S3 bucket ${bucket} with key ${downloadKey}`);
  const pdfData = downloadResponse.Body;

  const buffer = pdfData as Uint8Array;
  const loadingTask = pdfjsLib.getDocument({ data: buffer });
  const pdfDoc = await loadingTask.promise;
  console.log(`PDF loaded with ${pdfDoc.numPages} pages`);

  const docs: LGCDocument<PageMetadata>[] = [];
  for (let i = 1; i <= pdfDoc.numPages; i++) {
    const page = await pdfDoc.getPage(i);
    const textContent = await page.getTextContent();
    const text = textContent.items.map(item => {
        if ('str' in item) {
          return item.str;
        } else {
          return '';
        }
      }).join(' ');

      const metadata: PageMetadata = {
        chunk: i.toString(),
        text,
        url: pdfContent.url,
        source: 'PDF',
      };
      
      const doc: LGCDocument<PageMetadata> = {
        pageContent:text,
        metadata:metadata
      };
      
    docs.push(doc);
    console.log(`Page ${i} extracted with text content: "${text}"`);
  }
  console.log(`PDF document split into ${docs.length} pages`);
  return await split(docs);
}
