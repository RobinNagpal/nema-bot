import { uniswapString1, uniswapString2 } from '@/prompts/summarize/uniswapStrings';
import dotenv from 'dotenv';
import { Configuration, OpenAIApi } from 'openai';

dotenv.config();

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});

const openai = new OpenAIApi(configuration);
/**
 * This function summarizes the contents of a string. It uses the OpenAI API to do so.
 *  The length of the contents should be less than 16000 characters.
 *  The summary returned is between 1000 - 4000 characters.
 */
export async function summarizeContents(content: string): Promise<string> {
  const prompt = `${content}\n\nTl;dr`;
  const response = await openai.createCompletion({
    model: 'text-davinci-003',
    prompt: prompt,
    max_tokens: 500,
    temperature: 0.1,
    frequency_penalty: 0.7,
    presence_penalty: 0.6,
  });

  const data = response.data.choices[0].text?.trim();
  return data!;
}

const contentLimit = 16000;

async function splitAndReturnSummary(content: string): Promise<string> {
  const summaries: string[] = [];
  const splitChunks: string[] = [];
  let startPos = 0;

  while (startPos < content.length) {
    let endPos = startPos + contentLimit < content.length ? startPos + contentLimit : content.length;
    endPos = content.lastIndexOf(' ', endPos);
    splitChunks.push(content.substring(startPos, endPos));
    startPos = endPos;
  }

  for (const splitChunk of splitChunks) {
    const summarizedChunk = await summarizeContents(splitChunk);
    summaries.push(summarizedChunk);
  }

  return summaries.join(' ');
}

export async function recursivelySummarizeTheContents(contents: string[]): Promise<string> {
  const summaries: string[] = [];
  for (const content of contents) {
    if (content.length <= contentLimit) {
      summaries.push(await summarizeContents(content));
    } else {
      let summariesString = content;
      while (summariesString.length > contentLimit) {
        summariesString = await splitAndReturnSummary(summariesString);
      }
      summaries.push(await splitAndReturnSummary(content));
    }
  }

  let summariesString = summaries.join(' ');
  while (summariesString.length > contentLimit) {
    summariesString = await splitAndReturnSummary(summariesString);
  }

  return summariesString;
}

// Testing
// 1) Make sure the summary returned from OpenAI is about 1/4th the length of the content
// 2) Take a array with four strings 1) 1000 characters 2) 250000 characters 3) 10000 characters  4) 50000 characters
// 3) Debug and find the results

recursivelySummarizeTheContents([uniswapString1, uniswapString2]);
