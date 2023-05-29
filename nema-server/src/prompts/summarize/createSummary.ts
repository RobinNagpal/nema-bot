import { doScaping } from '@/loaders/siteScrappet';
import dotenv from 'dotenv';
import { Configuration, OpenAIApi } from 'openai';

dotenv.config();


const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});

const openai = new OpenAIApi(configuration);

async function generateSummary(chunk: string | undefined): Promise<string|undefined> {
  const prompt = `${chunk}\n\nTl;dr`;
  const maxCharacters = 16000;

  if(!chunk){
    return ''
  }
  if(chunk.length<=maxCharacters){

  
  const response = await openai.createCompletion({
    model: 'text-davinci-003',
    prompt: prompt,
    temperature: 0,
    max_tokens: 600,
    top_p: 1.0,
    frequency_penalty: 0.2,
    presence_penalty: 0.2,
  });
  const summary: string | undefined = response.data.choices[0].text?.trim();
  return summary || '';
}else{
  const splitIndex = chunk.lastIndexOf(' ',maxCharacters);
  const currentChunk = chunk.slice(0, 10000);
  const remainingChunk = chunk.slice(10001);
  const currentSummary = await generateSummary(currentChunk);
  const remainingSummary = await generateSummary(remainingChunk);
  return currentSummary + ' ' + remainingSummary;
}
}

async function generateQuestions(summary:string, numQuestions:number) {
  // Set up the conversation with the user message as the summary
 let newSummary:string|undefined=summary;

if(summary.length>= 4000){ 
   newSummary = await generateSummary(summary)
}

const prompt = `Create a list of ${numQuestions} most important questions and their answers from this data. Try to focus on the main context : \n ${newSummary}`;
 

  try {
    // Generate questions using OpenAI API
    const response = await openai.createCompletion({
      model: 'text-davinci-003',
      prompt:prompt,
      max_tokens: 800,
      temperature: 0.1,
      frequency_penalty: 0.7,
      presence_penalty: 0.6,
    });

    
    const questions = response.data.choices[0].text?.trim();
    console.log('generated questions: ',questions);
    return questions;
  } catch (error) {
    console.error('Error:', error);
    throw error;
  }
}

async function generateImportantPoints(summary:string){
  let newSummary:string|undefined=summary;

  if(summary.length>= 4000){ 
     newSummary = await generateSummary(summary)
  }
  
  const prompt = `create 10 most important points from the given data : \n${newSummary}`;
   
  
    try {
      // Generate questions using OpenAI API
      const response = await openai.createCompletion({
        model: 'text-davinci-003',
        prompt:prompt,
        max_tokens: 500,
        temperature: 0.1,
        frequency_penalty: 0.7,
        presence_penalty: 0.6,
      });
  
      
      const data = response.data.choices[0].text?.trim();
      console.log('generated Important points: ',data);
      return data;
    } catch (error) {
      console.error('Error:', error);
      throw error;
    }

}



export default async function createSummary() {


  const scrappedContent = await doScaping();
  const inputchunks: string[] = Object.values(scrappedContent);
  const outputchunks: Array<string | undefined> = [];

  for (const inputchunk of inputchunks) {
    // console.log('length of the input: ', inputchunk?.length);
    const output = await generateSummary(inputchunk);
    // console.log('this is the output:', output);
    outputchunks.push(output);
  }
  // console.log('length of the input: ', inputchunks.join(' ')?.length);
  // const output = await generateSummary(inputchunks.join(' '));
  // console.log('this is the output:', output);
  //   outputchunks.push(output);


  const joinedChunks = outputchunks.join(' ');
  // console.log("this is the combined summary: ",joinedChunks)
  const questionsList = await generateQuestions(joinedChunks,10);
  const importantPoints = await generateImportantPoints(joinedChunks);
  const finalSummary = await generateSummary(joinedChunks);

  console.log('this is final summary:', finalSummary);
}

createSummary();

