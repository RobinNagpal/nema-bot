import { Input } from 'components/core/form/Input';
import DragAndDrop from 'components/core/upload/DragAndDrop';
import { CreateOrUpdateDocumentInfoInput, useCreateSignedUrlMutation } from 'graphql/generated/generated-types';
import React from 'react';

interface EditDocumentInfoDetailsProps {
  type: string;
  details: any;
  updateDocumentInfoField: (field: keyof CreateOrUpdateDocumentInfoInput, value: any) => void;
  updateDetailsField: (field: string, value: any) => void;
}

export default function EditDocumentInfoDetails({ type, details, updateDetailsField, updateDocumentInfoField }: EditDocumentInfoDetailsProps) {
  const [createSignedUrlMutation] = useCreateSignedUrlMutation();
  // crate a function to handle the upload
  const handleUpload = async (files: File[]) => {
    const file = files[0];
    const { data } = await createSignedUrlMutation({
      variables: {
        spaceId: 'uniswap',
        namespace: 'uniswapV3',
        input: {
          name: file.name,
          contentType: file.type,
        },
      },
    });
    if (data?.createSignedUrl) {
      await fetch(data?.createSignedUrl, {
        method: 'PUT',
        body: file,
        headers: {
          'Content-Type': file.type,
        },
      });
      updateDocumentInfoField('url', data?.createSignedUrl.split('?')[0]);
    }
  };
  return (
    <div className="mb-4">
      {type === 'ARTICLE' && <Input modelValue={details.xpath} onChange={(e) => updateDetailsField('xpath', e.target.value)} label={'Xpath'} required={true} />}

      {type === 'DISCORD' && (
        <Input
          modelValue={details.serverId || ''}
          onChange={(e) => updateDetailsField('serverId', e.target.value)}
          label={'Discord Server Id'}
          required={true}
        />
      )}

      {type === 'GITHUB' && (
        <Input modelValue={details.branch || ''} onChange={(e) => updateDetailsField('branch', e.target.value)} label={'Github Branch'} required={true} />
      )}

      {type === 'PDF_DOCUMENT' && <DragAndDrop onUpload={handleUpload} label={'Enter Url or Upload File'} />}
    </div>
  );
}
