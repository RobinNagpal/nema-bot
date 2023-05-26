import { doScaping } from '@/loaders/siteScrappet';
import dotenv from 'dotenv';
import { Configuration, OpenAIApi } from 'openai';

dotenv.config();


const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});

const openai = new OpenAIApi(configuration);

async function generateSummary(chunk: string | undefined) {
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


  const scrappedContent = await doScaping();
  const inputchunks: string[] = Object.values(scrappedContent);
  const outputchunks: Array<string | undefined> = [];

  for (const inputchunk of inputchunks) {
    console.log('length of the input: ', inputchunk?.length);
    const output = await generateSummary(inputchunk);
    console.log('this is the output:', output);
    outputchunks.push(output);
  }
  const joinedChunks = outputchunks.join(' ');
  const finalSummary = await generateSummary(joinedChunks);

  console.log('this is final summary:', finalSummary);
}

createSummary();
