import { EditDocumentInfo } from 'components/documentInfo/EditDocumentInfo';
import DefaultLayout from 'components/layouts/DefaultLayout';
import { CreateOrUpdateDocumentInfoInput, DocumentInfosDocument, useCreateDocumentInfoMutation } from 'graphql/generated/generated-types';
import React from 'react';

const CreateDocumentInfo = () => {
  const [createDocumentInfo] = useCreateDocumentInfoMutation({
    refetchQueries: [{ query: DocumentInfosDocument }],
  });

  const handleSubmit = (documentInfo: CreateOrUpdateDocumentInfoInput) => {
    createDocumentInfo({ variables: { id: Date.now().toString(), spaceId: 'uniswap', input: documentInfo } });
  };

  return (
    <DefaultLayout>
      <EditDocumentInfo handleSubmit={handleSubmit} />
    </DefaultLayout>
  );
};

export default CreateDocumentInfo;
