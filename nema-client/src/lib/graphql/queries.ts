import { gql } from '@apollo/client';

export const DOCUMENT_INFOS = gql`
  query DocumentInfos {
    documentInfos {
      id
      name
      xpath
      url
      type
      branch
    }
  }
`;

export const DOCUMENT_INFO = gql`
  query DocumentInfo($id: String!) {
    documentInfo(id: $id) {
      id
      name
      xpath
      url
      type
      branch
    }
  }
`;

export const CREATE_DOCUMENT_INFO = gql`
  mutation CreateDocumentInfo($name: String!, $url: String!, $type: String!, $xpath: String, $branch: String) {
    createDocumentInfo(name: $name, url: $url, type: $type, xpath: $xpath, branch: $branch) {
      id
      name
      xpath
      url
      type
      branch
    }
  }
`;

export const UPDATE_DOCUMENT_INFO = gql`
  mutation UpdateDocumentInfo($id: String!, $name: String, $url: String, $type: String, $xpath: String, $branch: String) {
    updateDocumentInfo(id: $id, name: $name, url: $url, type: $type, xpath: $xpath, branch: $branch) {
      id
      name
      xpath
      url
      type
      branch
    }
  }
`;

export const DELETE_DOCUMENT_INFO = gql`
  mutation DeleteDocumentInfo($id: String!) {
    deleteDocumentInfo(id: $id) {
      id
      name
      xpath
      url
      type
      branch
    }
  }
`;
