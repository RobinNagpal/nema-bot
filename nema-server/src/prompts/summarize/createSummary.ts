import { uniswapGitbooks } from '@/contents/uniswapV3Contents';
import { indexDocument } from '@/indexer/indexDocument';
import { PineconeClient } from '@pinecone-database/pinecone';
import { Configuration,OpenAIApi } from 'openai';
import dotenv from 'dotenv';
dotenv.config();

let pinecone: PineconeClient | null = null;

const initPineconeClient = async () => {
  pinecone = new PineconeClient();
  await pinecone.init({
    environment: process.env.PINECONE_ENVIRONMENT!,
    apiKey: process.env.PINECONE_API_KEY!,
  });
};

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY
});

const openai = new OpenAIApi(configuration);


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

  const index = pinecone!.Index(process.env.PINECONE_INDEX_NAME!);


  // This
  await indexDocument(uniswapGitbooks[0], index)
  const inputchunk:Array<String|undefined> =[]
  const outputchunk:Array<String|undefined> =[]

 
  

  async function generateSummary(chunk:String|undefined){
    const response = await openai.createCompletion({
      model: "text-davinci-003",
      prompt: `Summarize this text in a way that a second-grade student would easily understand: \n\n ${chunk}  `,
      temperature: 0.7,
      max_tokens: 100,
      top_p: 1.0,
      frequency_penalty: 0.0,
      presence_penalty: 1,
    });
    const summary:String | undefined = response.data.choices[0].text?.trim()

    return summary
  
  }

  inputchunk.map(async(chunk)=>{
  const output = await generateSummary(chunk)
  outputchunk.push(output);
  })
const initialSummary = await outputchunk.join(" ")
const finalSummary = await generateSummary(initialSummary);


  


}





