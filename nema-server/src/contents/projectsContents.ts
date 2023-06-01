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

export interface PageMetadata {
  chunk: string;
  fullContent: string;
  url: string;
  source: string;
}
