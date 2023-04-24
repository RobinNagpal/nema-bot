import { DocumentInfo, DocumentInfoDocument, useDeleteDocumentInfoMutation, useDocumentInfosQuery } from 'graphql/generated/generated-types';
import React, { useState } from 'react';
import Dropdown from 'components/core/dropdown';
import UpdateDocumentInfo from 'components/documentInfo/UpdateDocumentInfo';

const Table = () => {
  const { loading, error, data } = useDocumentInfosQuery();

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error...</p>;

  return (
    <table className="table-auto w-full border-collapse">
      <thead>
        <tr className="bg-gray-200 text-gray-600 uppercase text-sm leading-normal">
          <th className="py-3 px-4 text-center">ID</th>
          <th className="py-3 px-4 text-center">Name</th>
          <th className="py-3 px-4 text-center">XPath</th>
          <th className="py-3 px-4 text-center">URL</th>
          <th className="py-3 px-4 text-center">Type</th>
          <th className="py-3 px-4 text-center">Branch</th>
          <th className="py-3 px-4 text-center">Actions</th>
        </tr>
      </thead>
      <tbody className="text-gray-600 text-sm font-light">
        {data?.documentInfos?.map((documentInfo) => (
          <TableRow key={documentInfo.id} documentInfo={documentInfo} />
        ))}
      </tbody>
    </table>
  );
};

const TableRow = ({ documentInfo }: { documentInfo: DocumentInfo }) => {
  const [deleteDocumentInfo] = useDeleteDocumentInfoMutation({
    variables: { id: documentInfo.id },
    refetchQueries: [{ query: DocumentInfoDocument }],
  });

  const [isEditing, setIsEditing] = useState(false);

  const handleEditClick = () => {
    setIsEditing(true);
  };

  const handleCancelClick = () => {
    setIsEditing(false);
  };

  return (
    <tr>
      <td className="border px-4 py-2 text-center">{documentInfo.id}</td>
      <td className="border px-4 py-2 text-center">{documentInfo.name}</td>
      <td className="border px-4 py-2 text-center">{documentInfo.xpath}</td>
      <td className="border px-4 py-2 text-center">{documentInfo.url}</td>
      <td className="border px-4 py-2 text-center">{documentInfo.type}</td>
      <td className="border px-4 py-2 text-center">{documentInfo.branch}</td>
      <td className="border px-4 py-2 text-center">
        {isEditing ? (
          <>
            <UpdateDocumentInfo documentInfo={documentInfo} handleCancelClick={handleCancelClick} />
          </>
        ) : (
          <>
            <Dropdown options={['Edit', 'Delete']} handleEdit={handleEditClick} handleDelete={deleteDocumentInfo} />
          </>
        )}
      </td>
    </tr>
  );
};

export default Table;
