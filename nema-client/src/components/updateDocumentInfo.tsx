import React, { useState } from 'react';
import { useMutation, useQuery } from '@apollo/client';
import { UPDATE_DOCUMENT_INFO, DOCUMENT_INFO } from '../lib/graphql/queries';
import Table from './documentsTable';

const UpdateDocumentInfo = ({ documentInfo, handleCancelClick }) => {
  const [name, setName] = useState(documentInfo.name);
  const [url, setUrl] = useState(documentInfo.url);
  const [type, setType] = useState(documentInfo.type);
  const [xpath, setXpath] = useState(documentInfo.xpath);
  const [branch, setBranch] = useState(documentInfo.branch);

  const [updateDocumentInfo] = useMutation(UPDATE_DOCUMENT_INFO, {
    variables: { id: documentInfo.id, name, url, type, xpath, branch },
    update(cache, { data: { updateDocumentInfo } }) {
      cache.modify({
        fields: {
          documentInfos(existingDocumentInfos, { readField }) {
            return existingDocumentInfos.map((docInfo) => {
              if (readField('id', docInfo) === updateDocumentInfo.id) {
                return updateDocumentInfo;
              } else {
                return docInfo;
              }
            });
          },
        },
      });
    },
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    updateDocumentInfo();
    handleCancelClick();
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
        <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
          <form onSubmit={handleSubmit}>
            <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
              <div className="sm:flex sm:items-start">
                <div className="w-full">
                  <div className="mb-4">
                    <label className="block text-gray-700 font-bold mb-2" htmlFor="name">
                      Name
                    </label>
                    <input
                      className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                      id="name"
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                    />
                  </div>
                  <div className="mb-4">
                    <label className="block text-gray-700 font-bold mb-2" htmlFor="url">
                      URL
                    </label>
                    <input
                      className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                      id="url"
                      type="text"
                      value={url}
                      onChange={(e) => setUrl(e.target.value)}
                    />
                  </div>
                  <div className="mb-4">
                    <label className="block text-gray-700 font-bold mb-2" htmlFor="type">
                      Type
                    </label>
                    <input
                      className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                      id="type"
                      type="text"
                      value={type}
                      onChange={(e) => setType(e.target.value)}
                    />
                  </div>
                  <div className="mb-4">
                    <label className="block text-gray-700 font-bold mb-2" htmlFor="xpath">
                      XPath
                    </label>
                    <input
                      className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                      id="xpath"
                      type="text"
                      value={xpath}
                      onChange={(e) => setXpath(e.target.value)}
                    />
                  </div>
                  <div className="mb-4">
                    <label className="block text-gray-700 font-bold mb-2" htmlFor="branch">
                      Branch
                    </label>
                    <input
                      className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                      id="branch"
                      type="text"
                      value={branch}
                      onChange={(e) => setBranch(e.target.value)}
                    />
                  </div>
                </div>
              </div>
            </div>
            <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
              <button
                type="submit"
                className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-indigo-600 text-base font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:ml-3 sm:w-auto sm:text-sm"
              >
                Save
              </button>
              <button
                onClick={handleCancelClick}
                type="button"
                className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:mt-0 sm:w-auto sm:text-sm"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default UpdateDocumentInfo;
