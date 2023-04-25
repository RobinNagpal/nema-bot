import Form from 'components/core/form/Form';
import { Input } from 'components/core/form/Input';
import EditDocumentInfoDetails from 'components/documentInfo/EditDocumentInfoDetails';
import DefaultLayout from 'components/layouts/DefaultLayout';
import { CreateOrUpdateDocumentInfoInput } from 'graphql/generated/generated-types';
import React, { useState } from 'react';

export interface EditDocumentInfoProps {
  documentInfo?: CreateOrUpdateDocumentInfoInput;
  handleSubmit: (documentInfo: CreateOrUpdateDocumentInfoInput) => void;
}

export const EditDocumentInfo = ({ handleSubmit, documentInfo: initial }: EditDocumentInfoProps) => {
  const [documentInfo, setDocumentInfo] = useState<CreateOrUpdateDocumentInfoInput>(
    initial || {
      name: '',
      url: '',
      type: '',
      details: {},
      namespace: 'uniswapV3',
    }
  );

  function updateDocumentInfoField(field: keyof CreateOrUpdateDocumentInfoInput, value: any) {
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

  return (
    <DefaultLayout>
      <div className="max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-3xl">
          <Form
            heading={'Create New Document'}
            infoText={'You can index this documents and then search for information from them'}
            onSave={() => handleSubmit(documentInfo)}
          >
            <Input modelValue={documentInfo.name} onChange={(e) => updateDocumentInfoField('name', e.target.value)} label={'Name'} required={true} />

            <Input modelValue={documentInfo.url} onChange={(e) => updateDocumentInfoField('url', e.target.value)} label={'Url'} required={true} />

            <Input modelValue={documentInfo.type} onChange={(e) => updateDocumentInfoField('type', e.target.value)} label={'Type'} required={true} />
            <EditDocumentInfoDetails type={documentInfo.type} details={documentInfo.details} updateDetailsField={updateDetailsField} />
          </Form>
        </div>
      </div>
    </DefaultLayout>
  );
};
