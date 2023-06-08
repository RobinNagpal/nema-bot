import { PageMetadata } from '@/contents/projectsContents';
import { Document as LGCDocument } from 'langchain/document';
import { generateSummaryOfContent } from '../summarize/createSummary';

function mergeChunk(bucket: LGCDocument<PageMetadata>[]) {
  const chunks: string[] = [];
  bucket.map((news) => {
    chunks.push(news.metadata.chunk);
  });

  const chunkString = chunks.join(' ');
  return chunkString;
}

async function generateNewsFromMergedChunk(chunk: string) {
  const promptFn = (chunk: string) =>
    `Given the information in the following content : ${chunk}, please generate a concise heading. Then, write a summary of no more than 30 words. Afterward, rewrite the content to fit within two paragraphs. Additionally, generate SEO keywords for this content, and identify the crypto projects mentioned within, if no crypto projects then mention "none" in the respective field. The response should be formatted as a JSON string, with fields for 'heading', 'summary', 'content', 'seo', and 'projects'`;
  const response = await generateSummaryOfContent(chunk, promptFn);

  console.log('response: ', response);

  const { heading, summary, content, seo, projects } = JSON.parse(response);

  return {
    heading: heading.trim(),
    summary: summary.trim(),
    content: content.trim(),
    seo: seo.trim(),
    projects: projects.trim(),
  };
}

function getSourcesFromBucket(bucket: LGCDocument<PageMetadata>[]) {
  const sources: string[] = [];
  bucket.map((news) => {
    sources.push(news.metadata.url);
  });
  return sources;
}

export async function writeNews(bucket: LGCDocument<PageMetadata>[]) {
  const mergedChunk = await mergeChunk(bucket);
  const sources = await getSourcesFromBucket(bucket);
  const news = await generateNewsFromMergedChunk(mergedChunk);

  const result = {
    news: news,
    sources: sources,
  };

  console.log('result: ', JSON.stringify(result));

  return JSON.stringify(result);
}
