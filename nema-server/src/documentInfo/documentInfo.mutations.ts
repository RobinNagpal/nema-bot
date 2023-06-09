import createDocumentInfo from '@/documentInfo/mutations/createDocumentInfo';
import createSignedUrl from '@/documentInfo/mutations/createSignedUrl';
import deleteDocumentInfo from '@/documentInfo/mutations/deleteDocumentInfo';
import indexDocumentInfo from '@/documentInfo/mutations/indexDocumentInfo';
import updateDocumentInfo from '@/documentInfo/mutations/updateDocumentInfo';

export default {
  createDocumentInfo,
  updateDocumentInfo,
  deleteDocumentInfo,
  indexDocumentInfo,
  createSignedUrl,
};
