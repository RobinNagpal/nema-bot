import { DocumentInfo, DocumentInfoType } from '@prisma/client';
import { GitbookContent, GithubContent, WebArticleContent } from './projectsContents';

const uniswapArticles: WebArticleContent[] = [
  {
    id: 'uniswap-impermanent-loss-whiteboardcrypto',
    url: 'https://whiteboardcrypto.com/impermanent-loss-calculator',
    type: DocumentInfoType.ARTICLE,
    spaceId: 'uniswap',
    namespace: 'uniswapV3',
    details: {
      xpath: '/html/body/div[1]/div/div[1]/div[2]/div[2]/section/div[1]',
    },
    name: 'Whiteboard Crypto - Impermanent Loss Calculator',
    createdAt: new Date(),
    updatedAt: new Date(),
    indexed: false,
    indexedAt: null,
  },
  {
    id: 'uniswap-impermanent-loss-chainbulletin',
    url: 'https://chainbulletin.com/impermanent-loss-explained-with-examples-math',

    type: DocumentInfoType.ARTICLE,
    spaceId: 'uniswap',
    namespace: 'uniswapV3',
    details: {
      xpath: '/html/body/div[1]/div/div/div[2]',
    },
    name: 'Chainbulletin - Impermanent Loss Calculator',
    createdAt: new Date(),
    updatedAt: new Date(),
    indexed: false,
    indexedAt: null,
  },
  // other
  {
    id: 'uniswap-impermanent-loss-blockworks',
    url: 'https://blockworks.co/news/the-investors-guide-to-navigating-impermanent-loss',

    type: DocumentInfoType.ARTICLE,
    spaceId: 'uniswap',
    namespace: 'uniswapV3',
    details: {
      xpath: '/html/body/div[1]/div/main/section[1]/div[1]/article/div[3]',
    },
    name: 'Blockworks - Impermanent Loss Calculator',
    createdAt: new Date(),
    updatedAt: new Date(),
    indexed: false,
    indexedAt: null,
  },
  {
    id: 'uniswap-impermanent-loss-ledger',
    url: 'https://www.ledger.com/academy/glossary/impermanent-loss',

    type: DocumentInfoType.ARTICLE,
    spaceId: 'uniswap',
    namespace: 'uniswapV3',
    details: {
      xpath: '/html/body/main/div/div',
    },
    name: 'Ledger - Impermanent Loss Calculator',
    createdAt: new Date(),
    updatedAt: new Date(),
    indexed: false,
    indexedAt: null,
  },
  {
    id: 'uniswap-impermanent-loss-coinmonks-medium',
    url: 'https://medium.com/coinmonks/understanding-impermanent-loss-9ac6795e5baa',
    type: DocumentInfoType.ARTICLE,
    spaceId: 'uniswap',
    namespace: 'uniswapV3',
    details: {
      xpath: '/html/body/div[1]/div/div[3]/div[2]/div/main/div/div[3]/div/div/article/div/div[2]/section/div/div[2]',
    },
    name: 'Coinmonks - Impermanent Loss Calculator',
    createdAt: new Date(),
    updatedAt: new Date(),
    indexed: false,
    indexedAt: null,
  },
];
export const uniswapGitbooks: GitbookContent[] = [
  {
    id: 'uniswap-v3-gitbook',
    type: DocumentInfoType.GITBOOK,
    url: 'https://docs.uniswap.org/',
    spaceId: 'uniswap',
    namespace: 'uniswapV3',
    details: {},
    name: 'Gitbook Docs - Uniswap V3',
    createdAt: new Date(),
    updatedAt: new Date(),
    indexed: false,
    indexedAt: null,
  },
];
const uniswapGithub: GithubContent[] = [
  {
    id: 'uniswap-v3-github',
    type: DocumentInfoType.GITHUB,
    url: 'https://github.com/Uniswap/v3-core',

    spaceId: 'uniswap',
    namespace: 'uniswapV3',
    name: 'Github Code - Uniswap V3',
    details: {
      branch: 'main',
    },
    createdAt: new Date(),
    updatedAt: new Date(),
    indexed: false,
    indexedAt: null,
  },
];

export const uniswapV3Contents: DocumentInfo[] = [...uniswapArticles, ...uniswapGitbooks, ...uniswapGithub];
