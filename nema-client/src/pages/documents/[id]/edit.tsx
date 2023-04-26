import { EditDocumentInfo } from 'components/documentInfo/EditDocumentInfo';
import DefaultLayout from 'components/layouts/DefaultLayout';
import { CreateOrUpdateDocumentInfoInput, DocumentInfoDocument, useDocumentInfoQuery, useUpdateDocumentInfoMutation } from 'graphql/generated/generated-types';
import { useRouter } from 'next/router';
import React from 'react';

const UpdateDocumentInfo = () => {
  const router = useRouter();
  const { id } = router.query;
  const { data } = useDocumentInfoQuery({ variables: { id: id as string }, skip: !id });
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
