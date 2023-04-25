import EllipsisDropdown from 'components/core/dropdowns/EllipsisDropdown';
import { Table } from 'components/core/table/Table';
import DefaultLayout from 'components/layouts/DefaultLayout';
import { useDocumentInfosQuery } from 'graphql/generated/generated-types';
import { useRouter } from 'next/router';
import React from 'react';

const Docs = () => {
  const { loading, error, data } = useDocumentInfosQuery();
  const router = useRouter();

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error...</p>;

  return (
    <DefaultLayout>
      <div className="float-right">
        <EllipsisDropdown
          items={[{ label: 'Add New', item: 'Add New' }]}
          onSelect={() => {
            router.push('/documents/create');
          }}
        />
      </div>
      <Table
        heading={'All Documents'}
        data={data?.documentInfos?.map((documentInfo) => [documentInfo.id, documentInfo.name, documentInfo.type]) || []}
        columnsWidthPercents={[10, 20, 20]}
        columnsHeadings={['ID', 'Name', 'Type']}
      />
    </DefaultLayout>
  );
};

export default Docs;
