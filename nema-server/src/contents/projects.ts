import { Content } from '@/contents/projectsContents';
import { uniswapV3Contents } from '@/contents/uniswapV3Contents';

export interface Project {
  id: string;
  namespace: string;
  contents: Content[];
  indexName: string;
}

export const uniswapV3ProjectContents: Project = {
  id: 'uniswapV3',
  namespace: 'uniswapV3',
  contents: uniswapV3Contents,
  indexName: 'dodao-test',
};
