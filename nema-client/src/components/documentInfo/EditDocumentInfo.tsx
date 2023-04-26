import Form from 'components/core/form/Form';
import { Input } from 'components/core/form/Input';
import Select, { SelectOption } from 'components/core/form/Select';
import EditDocumentInfoDetails from 'components/documentInfo/EditDocumentInfoDetails';
import DefaultLayout from 'components/layouts/DefaultLayout';
import { CreateOrUpdateDocumentInfoInput } from 'graphql/generated/generated-types';
import React, { useEffect, useState } from 'react';

export interface EditDocumentInfoProps {
  documentInfo?: CreateOrUpdateDocumentInfoInput;
  handleSubmit: (documentInfo: CreateOrUpdateDocumentInfoInput) => void;
}

export const EditDocumentInfo = ({ handleSubmit, documentInfo: initial }: EditDocumentInfoProps) => {
  const [documentInfo, setDocumentInfo] = useState<CreateOrUpdateDocumentInfoInput>({
    name: '',
    url: '',
    type: '',
    details: {},
    namespace: 'uniswapV3',
    ...initial,
  });

  useEffect(() => {
    if (initial) {
      setDocumentInfo(initial);
    }
  }, [initial]);

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

  const selectOptions: SelectOption[] = [
    { key: 'ARTICLE', value: 'ARTICLE' },
    { key: 'DISCORD', value: 'DISCORD' },
    { key: 'DISCOURSE', value: 'DISCOURSE' },
    { key: 'GITBOOK', value: 'GITBOOK' },
    { key: 'GITHUB', value: 'GITHUB' },
    { key: 'IMAGE', value: 'IMAGE' },
    { key: 'PDF_DOCUMENT', value: 'PDF_DOCUMENT' },
  ];

  return (
    <div className="mt-10">
      <Form
        heading={'Create New Document'}
        infoText={'You can index this documents and then search for information from them'}
        onSave={() => handleSubmit(documentInfo)}
      >
        <Input modelValue={documentInfo.name} onChange={(e) => updateDocumentInfoField('name', e.target.value)} label={'Name'} required={true} />

        <Input modelValue={documentInfo.url} onChange={(e) => updateDocumentInfoField('url', e.target.value)} label={'Url'} required={true} />

        <Select options={selectOptions} onChange={(e) => updateDocumentInfoField('type', e)} id="document_info_type_select_id" label="Type" />
        <EditDocumentInfoDetails type={documentInfo.type} details={documentInfo.details} updateDetailsField={updateDetailsField} />
      </Form>
    </div>
  );
};
