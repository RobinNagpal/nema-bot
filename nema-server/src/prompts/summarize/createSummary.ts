import { uniswapTestStrings } from '@/prompts/summarize/uniswapStrings';
import dotenv from 'dotenv';
import { Configuration, OpenAIApi } from 'openai';

dotenv.config();

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});

const openai = new OpenAIApi(configuration);

export async function generateSummaryOfContent(
  chunk: string,
  promptFn = (chunk: string) => `summarize the following content in 1000 - 4000 characters ${chunk}\n\n`
): Promise<string> {
  const maxCharacters = 15000;

  if (!chunk) {
    return '';
  }
  if (chunk.length <= maxCharacters) {
    const response = await openai.createCompletion({
      model: 'text-davinci-003',
      prompt: promptFn(chunk),
      temperature: 0,
      max_tokens: 500,
      top_p: 1.0,
      frequency_penalty: 0.2,
      presence_penalty: 0.2,
    });
    const summary: string | undefined = response.data.choices[0].text?.trim();
    return summary || '';
  } else {
    const chunkCount = Math.ceil(chunk.length / maxCharacters);
    const chunkSize = Math.ceil(chunk.length / chunkCount);
    const chunks: string[] = [];

    for (let i = 0; i < chunkCount; i++) {
      const start = i * chunkSize;
      const end = start + chunkSize;
      const currentChunk = chunk.slice(start, end);
      chunks.push(currentChunk);
    }

    const summaries: Array<string | undefined> = [];

    for (const currentChunk of chunks) {
      console.log('chunk length: ' + currentChunk.length);
      const currentSummary = await generateSummaryOfContent(currentChunk);
      summaries.push(currentSummary);
    }

    return summaries.join(' ');
  }
}

async function generateQuestions(summary: string, numQuestions: number) {
  // Set up the conversation with the user message as the summary
  let newSummary: string | undefined = summary;
  console.log('num of questions:', numQuestions);
  if (summary.length >= 15000) {
    newSummary = await generateSummaryOfContent(summary);
  }

  const prompt = `Create a list of ${numQuestions} most important questions and their answers from this data. Make sure that the questions are not reapeated : \n ${newSummary}`;

  try {
    // Generate questions using OpenAI API
    const response = await openai.createCompletion({
      model: 'text-davinci-003',
      prompt: prompt,
      max_tokens: 800,
      temperature: 0.1,
      frequency_penalty: 0.7,
      presence_penalty: 0.6,
    });

    const questions = response.data.choices[0].text?.trim();
    console.log('generated questions: ', questions);
    return questions;
  } catch (error) {
    console.error('Error:', error);
    throw error;
  }
}

export async function generateImportantPoints(summary: string) {
  let newSummary: string | undefined = summary;

  if (summary.length >= 15000) {
    newSummary = await generateSummaryOfContent(summary);
  }

  const prompt = `create 10 most important points from the given data. Don't number the important points : \n${newSummary}`;

  
  try {
    // Generate questions using OpenAI API
    const response = await openai.createCompletion({
      model: 'text-davinci-003',
      prompt: prompt,
      max_tokens: 500,
      temperature: 0.1,
      frequency_penalty: 0.7,
      presence_penalty: 0.6,
    });

    const data = response.data.choices[0].text?.trim();

    if (data) {
      const questionsArray = data.split('\n').map(question => question.replace(/^\d+\.\s*/, ''));
      console.log('generated Important points: ', questionsArray);
      return questionsArray;
    } else {
      throw new Error('Failed to generate questions.');
    }
  } catch (error) {
    console.error('Error:', error);
    throw error;
  }
}

export default async function createSummary() {
  // const scrappedContent = await doScaping();
  // const inputchunks: string[] = Object.values(scrappedContent);
  const inputchunks: string[] = uniswapTestStrings;
  const outputchunks: Array<string | undefined> = [];

  for (const inputchunk of inputchunks) {
    console.log('length of the input: ', inputchunk?.length);
    const output = await generateSummaryOfContent(inputchunk);
    outputchunks.push(output);
  }

  const joinedChunks = outputchunks.join(' ');
  // console.log("this is the combined summary: ",joinedChunks)
  const questionsList = await generateQuestions(joinedChunks, 10);
  const importantPoints = await generateImportantPoints(joinedChunks);
  const finalSummary = await generateSummaryOfContent(joinedChunks);

  console.log('this is final summary:', finalSummary);
  // console.log('final summary length: ', finalSummary?.length);
}


