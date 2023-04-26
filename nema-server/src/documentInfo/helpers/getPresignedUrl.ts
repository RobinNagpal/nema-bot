import { CreateSignedUrlInput } from '@/graphql/generated/graphql';
import { slugify } from '@/utils/slugify';
import { ObjectCannedACL, PutObjectCommand, S3Client } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { S3 } from 'aws-sdk';

export const s3Config = {
  bucketName: String(process.env.PUBLIC_AWS_S3_BUCKET),
  defaultRegion: String(process.env.AWS_DEFAULT_REGION),
};

export class PresignedUrlCreator {
  private client: S3;

  private readonly bucketName = s3Config.bucketName;

  constructor() {
    this.client = new S3({
      region: s3Config.defaultRegion,
    });
  }

  async createSignedUrl(spaceId: string, namespace: string, args: CreateSignedUrlInput): Promise<string> {
    const { contentType, name } = args;

    const client = new S3Client({
      region: s3Config.defaultRegion,
    });
    const command = new PutObjectCommand({
      Key: `${spaceId}/temp-uploads/${namespace}/${Date.now()}_${slugify(name)}`,
      Bucket: s3Config.bucketName,
      ContentType: contentType,
      ACL: ObjectCannedACL.public_read,
    });
    return await getSignedUrl(client, command, { expiresIn: 3600 });
  }
}

export const presignedUrlCreator = new PresignedUrlCreator();
