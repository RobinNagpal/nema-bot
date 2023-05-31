import { doScaping } from '@/loaders/siteScrappet';
import dotenv from 'dotenv';
import { Configuration, OpenAIApi } from 'openai';

dotenv.config();

// let pinecone: PineconeClient | null = null;

// const initPineconeClient = async () => {
//   pinecone = new PineconeClient();
//   await pinecone.init({
//     environment: process.env.PINECONE_ENVIRONMENT!,
//     apiKey: process.env.PINECONE_API_KEY!,
//   });
// };

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});

const openai = new OpenAIApi(configuration);

export async function generateSummaryOfContent(chunk: string) {
  const prompt = `${chunk}\n\nTl;dr`;
  const response = await openai.createCompletion({
    model: 'text-davinci-003',
    prompt: prompt,
    temperature: 0,
    max_tokens: 130,
    top_p: 1.0,
    frequency_penalty: 0.2,
    presence_penalty: 0.2,
  });
  const summary: string | undefined = response.data.choices[0].text?.trim();
  return summary || '';
}

export default async function createSummary() {
  // 1) Update README.md to include all the missing steps and how to test if the local
  // setup is working

  // 2) Setup pinecone
  // Read gitbook contents. Make sure gitbook contents are not having HTML or CSS.
  // Also read PDF doc and index it

  // 3) We read all the contents as string
  // 4) We chunk the string into 12-20k characters
  // 5) Write a prompt to get the summary of the chunk
  // 6) Combine all the summaries and resummarize it. This is the final summary

  // Some of  the things we need to consider
  // There is something call map reduce chain, which can make this process faster
  // Prompts needs to be created carefully.

  // const index = pinecone!.Index(process.env.PINECONE_INDEX_NAME!);

  // This
  // await indexDocument(uniswapGitbooks[0], index)

  const scrappedContent = await doScaping();
  const inputchunks: string[] = Object.values(scrappedContent);
  const outputchunks: Array<string | undefined> = [];

  for (const inputchunk of inputchunks) {
    console.log('length of the input: ', inputchunk?.length);
    const output = await generateSummaryOfContent(inputchunk);
    console.log('this is the output:', output);
    outputchunks.push(output);
  }
  const joinedChunks = outputchunks.join(' ');
  const finalSummary = await generateSummaryOfContent(joinedChunks);

  console.log('this is final summary:', finalSummary);
}

createSummary();
