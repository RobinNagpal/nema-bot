import { EditDocumentInfo } from 'components/documentInfo/EditDocumentInfo';
import DefaultLayout from 'components/layouts/DefaultLayout';
import { CreateOrUpdateDocumentInfoInput, DocumentInfoDocument, useDocumentInfoQuery, useUpdateDocumentInfoMutation } from 'graphql/generated/generated-types';
import React from 'react';

const UpdateDocumentInfo = () => {
  const { data } = useDocumentInfoQuery({ variables: { id: '1' } });
  const [updateDocumentInfoMutation] = useUpdateDocumentInfoMutation({
    refetchQueries: [{ query: DocumentInfoDocument, variables: { id: data?.documentInfo.id } }],
  });

  const handleSubmit = (e: CreateOrUpdateDocumentInfoInput) => {
    updateDocumentInfoMutation();
  };

  return (
    <DefaultLayout>
      <EditDocumentInfo handleSubmit={handleSubmit} documentInfo={data?.documentInfo} />
    </DefaultLayout>
  );
};

export default UpdateDocumentInfo;
