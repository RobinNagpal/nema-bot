import EllipsisDropdown from 'components/core/dropdowns/EllipsisDropdown';
import { Table, TableActions, TableRow } from 'components/core/table/Table';
import DefaultLayout from 'components/layouts/DefaultLayout';
import { DocumentInfo, useDocumentInfosQuery } from 'graphql/generated/generated-types';
import { useRouter } from 'next/router';
import React from 'react';

const Docs = () => {
  const { loading, error, data } = useDocumentInfosQuery();
  const router = useRouter();

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error...</p>;

  const actions: TableActions = {
    items: [
      { label: 'Edit', key: 'edit' },
      { label: 'Delete', key: 'delete' },
    ],
    onSelect: (key, item: DocumentInfo) => {
      switch (key) {
        case 'edit':
          router.push(`/documents/${item.id}/edit`);
          break;
        case 'delete':
          break;
      }
    },
  };
  return (
    <DefaultLayout>
      <div className="float-right">
        <EllipsisDropdown
          items={[{ label: 'Add New', key: 'add_new' }]}
          onSelect={() => {
            router.push('/documents/create');
          }}
        />
      </div>
      <Table
        heading={'All Documents'}
        data={
          data?.documentInfos?.map(
            (documentInfo): TableRow => ({ id: documentInfo.id, item: documentInfo, columns: [documentInfo.id, documentInfo.name, documentInfo.type] })
          ) || []
        }
        columnsWidthPercents={[10, 20, 20]}
        columnsHeadings={['ID', 'Name', 'Type']}
        actions={actions}
      />
    </DefaultLayout>
  );
};

export default Docs;
