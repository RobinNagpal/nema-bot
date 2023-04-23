import React, { useState } from 'react';
import { useMutation } from '@apollo/client';
import { CREATE_DOCUMENT_INFO, DOCUMENT_INFOS } from '../lib/graphql/queries';

const CreateDocumentInfo = () => {
  const [formData, setFormData] = useState({
    name: '',
    url: '',
    type: '',
    xpath: '',
    branch: '',
  });

  const [createDocumentInfo] = useMutation(CREATE_DOCUMENT_INFO, {
    update(cache, { data: { createDocumentInfo } }) {
      const existingDocumentInfos = cache.readQuery({
        query: DOCUMENT_INFOS,
      });
      cache.writeQuery({
        query: DOCUMENT_INFOS,
        data: { documentInfos: [createDocumentInfo, ...existingDocumentInfos.documentInfos] },
      });
    },
  });

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    createDocumentInfo({ variables: formData });
  };

  return (
    <form onSubmit={handleSubmit}>
      <label htmlFor="name">Name:</label>
      <input className="border-2 p-1 m-2" type="text" id="name" name="name" value={formData.name} onChange={handleChange} required />

      <label htmlFor="url">URL:</label>
      <input className="border-2 p-1 m-2" type="text" id="url" name="url" value={formData.url} onChange={handleChange} required />

      <label htmlFor="type">Type:</label>
      <input className="border-2 p-1 m-2" type="text" id="type" name="type" value={formData.type} onChange={handleChange} required />

      <label htmlFor="xpath">XPath:</label>
      <input className="border-2 p-1 m-2" type="text" id="xpath" name="xpath" value={formData.xpath} onChange={handleChange} />

      <label htmlFor="branch">Branch:</label>
      <input className="border-2 p-1 m-2" type="text" id="branch" name="branch" value={formData.branch} onChange={handleChange} />

      <button type="submit" className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded">
        Create Document Info
      </button>
    </form>
  );
};

export default CreateDocumentInfo;
