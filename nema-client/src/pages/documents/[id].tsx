import Form from 'components/core/form/Form';
import { Input } from 'components/core/form/Input';
import EditDocumentInfoDetails from 'components/documentInfo/EditDocumentInfoDetails';
import { CreateDocumentInfoMutationVariables, DocumentInfosDocument, useCreateDocumentInfoMutation } from 'graphql/generated/generated-types';
import React, { useState } from 'react';

export interface CreateDocumentInfoProps {
  handleCreateCancel: () => void;
}

const CreateDocumentInfo = ({ handleCreateCancel }: CreateDocumentInfoProps) => {
  const [documentInfo, setDocumentInfo] = useState<CreateDocumentInfoMutationVariables>({
    id: Date.now().toString(),
    name: '',
    url: '',
    type: '',
    details: {},
    spaceId: 'uniswap',
    namespace: 'uniswapV3',
  });

  function updateDocumentInfoField(field: keyof CreateDocumentInfoMutationVariables, value: any) {
    setDocumentInfo({
      ...documentInfo,
      [field]: value,
    });
  }

  function updateDetailsField(field: string, value: any) {
    setDocumentInfo({
      ...documentInfo,
      details: {
        ...documentInfo.details,
        [field]: value,
      },
    });
  }

  const [createDocumentInfo] = useCreateDocumentInfoMutation({
    variables: { ...documentInfo },
    refetchQueries: [{ query: DocumentInfosDocument }],
  });

  const handleSubmit = () => {
    createDocumentInfo();
    handleCreateCancel();
  };

  return (
    <div className="fixed z-10 inset-0 overflow-y-auto">
      <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
        <div className="fixed inset-0 transition-opacity" aria-hidden="true">
          <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
        </div>
        <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">
          &#8203;
        </span>
        <Form
          heading={'Create New Document'}
          infoText={'You can index this documents and then search for information from them'}
          onSave={handleSubmit}
          onCancel={handleCreateCancel}
        >
          <Input modelValue={documentInfo.name} onChange={(e) => updateDocumentInfoField('name', e.target.value)} label={'Name'} required={true} />

          <Input modelValue={documentInfo.url} onChange={(e) => updateDocumentInfoField('url', e.target.value)} label={'Url'} required={true} />

          <Input modelValue={documentInfo.type} onChange={(e) => updateDocumentInfoField('type', e.target.value)} label={'Type'} required={true} />
          <EditDocumentInfoDetails type={documentInfo.type} details={documentInfo.details} updateDetailsField={updateDetailsField} />
        </Form>
      </div>
    </div>
  );
};

export default CreateDocumentInfo;
