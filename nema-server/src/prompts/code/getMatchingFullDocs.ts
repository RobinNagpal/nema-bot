import { getMatchesFromEmbeddings, Metadata } from '@/matches';
import { PineconeClient } from '@pinecone-database/pinecone';

export async function getMatchingFullDocs(pinecone: PineconeClient, inquiryEmbeddings: number[]): Promise<string[]> {
  const matches = await getMatchesFromEmbeddings(inquiryEmbeddings, pinecone, 3);

  console.log('matches', matches.length);
  // console.log('matches: ', matches);

  // const urls = docs && Array.from(new Set(docs.map(doc => doc.metadata.url)))

  const urls =
    matches &&
    Array.from(
      new Set(
        matches.map((match) => {
          const metadata = match.metadata as Metadata;
          const { url } = metadata;
          return url;
        })
      )
    );

  console.log(urls);

  const fullDocuments: string[] =
    matches &&
    Array.from(
      matches.reduce((map, match) => {
        const metadata = match.metadata as Metadata;
        const { text, url } = metadata;
        if (!map.has(url)) {
          map.set(url, text);
        }
        return map;
      }, new Map())
    ).map(([_, text]) => text);

  return fullDocuments;
}
