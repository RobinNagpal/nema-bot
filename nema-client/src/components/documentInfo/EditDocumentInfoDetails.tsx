import { Input } from 'components/core/form/Input';
import React from 'react';

interface EditDocumentInfoDetailsProps {
  type: string;
  details: any;
  updateDetailsField: (field: string, value: any) => void;
}

export default function EditDocumentInfoDetails({ type, details, updateDetailsField }: EditDocumentInfoDetailsProps) {
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
    </div>
  );
}
