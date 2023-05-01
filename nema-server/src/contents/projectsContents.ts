import { DocumentInfo } from '@prisma/client';

export interface Content extends DocumentInfo {
  id: string;
  url: string;
}

export interface WebArticleContent extends Content {
  type: 'ARTICLE';
  details: {
    xpath: string;
  };
}

export interface GitbookContent extends Content {
  type: 'GITBOOK';
}

export interface GithubContent extends Content {
  type: 'GITHUB';

  details: {
    branch: string;
  };
}

export interface DiscordContent extends Content {
  type: 'DISCORD';
  serverId: string;
  includeChannels: string[];
  includeUsers: string[];
}

export interface PDFContent extends Content {
  type: 'PDF_DOCUMENT';
}

export interface PageMetadata {
  chunk: string;
  text: string;
  url: string;
  source: string;
}
