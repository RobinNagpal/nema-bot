import { CreateSignedUrlInput } from '@/graphql/generated/graphql';
import { slugify } from '@/utils/slugify';
import { ObjectCannedACL, PutObjectCommand, S3Client } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { S3 } from 'aws-sdk';

const s3Config = {
  credentials: {
    accessKeyId: String(process.env.NEMA_AWS_ACCESS_KEY_ID),
    secretAccessKey: String(process.env.NEMA_AWS_SECRET_ACCESS_KEY),
  },
  region: process.env.AWS_DEFAULT_REGION,
};

console.log('s3Config', s3Config);
export class PresignedUrlCreator {
  private client: S3;

  constructor() {
    this.client = new S3(s3Config);
  }

  async createSignedUrl(spaceId: string, namespace: string, args: CreateSignedUrlInput): Promise<string> {
    const { contentType, name } = args;

    const client = new S3Client(s3Config);
    const command = new PutObjectCommand({
      Key: `${spaceId}/temp-uploads/${namespace}/${Date.now()}_${slugify(name)}`,
      Bucket: process.env.NEMA_PUBLIC_AWS_S3_BUCKET,
      ContentType: contentType,
      ACL: ObjectCannedACL.public_read,
    });
    return await getSignedUrl(client, command, { expiresIn: 3600 });
  }
}

export const presignedUrlCreator = new PresignedUrlCreator();
