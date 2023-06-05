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
    `Write a crisp heading for the content:\n\n${chunk}\n\nwrite a summary in under 30 words:\n\nRewrite the given content under 2 paragraphs:\n\nalso generate SEO for this content:\n\n return a json string of which has heading, summary, content, and seo`;
  const response = await generateSummaryOfContent(chunk, promptFn);
  const [heading, summary, content, seo] = JSON.parse(response);

  return {
    heading: heading.trim(),
    summary: summary.trim(),
    content: content.trim(),
    seo: seo.trim(),
  };
}

function getSourcesFromBucket(bucket: LGCDocument<PageMetadata>[]) {
  const sources: string[] = [];
  bucket.map((news) => {
    sources.push(news.metadata.url);
  });
  return sources;
}

async function writeNews(bucket: LGCDocument<PageMetadata>[]) {
  const mergedChunk = mergeChunk(bucket);
  const sources = getSourcesFromBucket(bucket);
  const news = generateNewsFromMergedChunk(mergedChunk);

  return { news, ...sources };
}
