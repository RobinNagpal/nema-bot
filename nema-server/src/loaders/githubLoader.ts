import { GithubContent, PageMetadata } from '@/contents/projectsContents';
import { split } from '@/loaders/splitter';
import { Document as LGCDocument } from 'langchain/document';
import { GithubRepoLoader } from 'langchain/document_loaders';

export async function loadGithubData(content: GithubContent): Promise<LGCDocument<PageMetadata>[]> {
  const githubLoader = new GithubRepoLoader(content.url, {
    branch: content.details.branch,
    recursive: true,
    unknown: 'warn',
  });
  const docs: LGCDocument[] = await githubLoader.load();
  const updatedDocs = docs.map((doc): LGCDocument<Omit<PageMetadata, 'chunk'>> => {
    const metadata: Omit<PageMetadata, 'chunk'> = {
      url: doc.metadata.source,
      text: doc.pageContent,
      source: doc.metadata.source,
    };
    return { ...doc, metadata };
  });
  return split(updatedDocs);
}
