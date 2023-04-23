import React, { useState } from 'react';
import { useQuery, useMutation } from '@apollo/client';
import { DOCUMENT_INFOS, DELETE_DOCUMENT_INFO } from '../lib/graphql/queries';
import CreateDocumentInfo from './createDocumentInfo';
import UpdateDocumentInfo from './updateDocumentInfo';

const Table = () => {
  const { loading, error, data } = useQuery(DOCUMENT_INFOS);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error...</p>;

  return (
    <>
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
          {data.documentInfos.map((documentInfo) => (
            <TableRow key={documentInfo.id} documentInfo={documentInfo} />
          ))}
        </tbody>
      </table>
      <CreateDocumentInfo />
    </>
  );
};

const TableRow = ({ documentInfo }) => {
  const [deleteDocumentInfo] = useMutation(DELETE_DOCUMENT_INFO, {
    variables: { id: documentInfo.id },
    update(cache) {
      const existingDocumentInfos = cache.readQuery({
        query: DOCUMENT_INFOS,
      });
      const newDocumentInfos = existingDocumentInfos.documentInfos.filter((docInfo) => docInfo.id !== documentInfo.id);
      cache.writeQuery({
        query: DOCUMENT_INFOS,
        data: { documentInfos: newDocumentInfos },
      });
    },
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
            {/* <button onClick={handleCancelClick}>Cancel</button> */}
          </>
        ) : (
          <>
            <div className="flex justify-center">
              <button onClick={handleEditClick} className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mx-4">
                Edit
              </button>
              <button onClick={deleteDocumentInfo} className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded mx-4">
                Delete
              </button>
            </div>
          </>
        )}
      </td>
    </tr>
  );
};

export default Table;
