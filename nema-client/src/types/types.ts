export interface DocumentInfo {
  id: string;
  name: string;
  xpath: string | null;
  url: string;
  type: string;
  branch: string | null;
}

export interface DocumentInfosQuery {
  documentInfos: DocumentInfo[];
}

export interface DocumentInfoQuery {
  documentInfo: DocumentInfo;
}

export interface CreateDocumentInfoMutation {
  createDocumentInfo: DocumentInfo;
}

export interface UpdateDocumentInfoMutation {
  updateDocumentInfo: DocumentInfo;
}

export interface DeleteDocumentInfoMutation {
  deleteDocumentInfo: DocumentInfo;
}
