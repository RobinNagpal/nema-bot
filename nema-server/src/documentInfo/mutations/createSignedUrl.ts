import { presignedUrlCreator } from '@/documentInfo/helpers/getPresignedUrl';
import { MutationCreateSignedUrlArgs } from '@/graphql/generated/graphql';

export default async function createSignedUrl(_: any, args: MutationCreateSignedUrlArgs) {
  return await presignedUrlCreator.createSignedUrl(args.spaceId, args.namespace, args.input);
}
