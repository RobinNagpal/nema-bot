import { Table, TableRow } from 'components/core/table/Table';
import DefaultLayout from 'components/layouts/DefaultLayout';
import { useDocumentInfosQuery } from 'graphql/generated/generated-types';
import { withLoadingError } from 'hocs/withLoadingError';
import { useDocumentActions } from 'hooks/useDocumentInfoActions';
import { useRouter } from 'next/router';
import React from 'react';

const RenderDocumentInfosTable = withLoadingError((props: { data: TableRow[] }) => {
  const router = useRouter();
  const actions = useDocumentActions();

  return (
    <DefaultLayout>
      <Table
        heading={'All Documents'}
        onAddNew={() => {
          router.push('/documents/create');
        }}
        data={props.data}
        columnsWidthPercents={[10, 20, 20]}
        columnsHeadings={['ID', 'Name', 'Type']}
        actions={actions}
      />
    </DefaultLayout>
  );
});

const Docs = () => {
  const { loading, error, data } = useDocumentInfosQuery();

  const tableData =
    data?.documentInfos?.map(
      (documentInfo): TableRow => ({
        id: documentInfo.id,
        item: documentInfo,
        columns: [documentInfo.id, documentInfo.name, documentInfo.type],
      })
    ) || [];
  return <RenderDocumentInfosTable data={tableData} loading={loading} error={error} />;
};

export default Docs;
