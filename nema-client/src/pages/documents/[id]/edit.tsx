import { EditDocumentInfo } from 'components/documentInfo/EditDocumentInfo';
import DefaultLayout from 'components/layouts/DefaultLayout';
import { CreateOrUpdateDocumentInfoInput, DocumentInfoDocument, useDocumentInfoQuery, useUpdateDocumentInfoMutation } from 'graphql/generated/generated-types';
import { useRouter } from 'next/router';
import React from 'react';
import Link from 'next/link';

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
      <Link className="cursor-pointer" href="/documents">
        &#8592; Back
      </Link>
      <EditDocumentInfo handleSubmit={handleSubmit} documentInfo={data?.documentInfo} />
    </DefaultLayout>
  );
};

export default UpdateDocumentInfo;
