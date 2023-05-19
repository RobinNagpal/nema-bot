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

  // const index = pinecone!.Index(process.env.PINECONE_INDEX_NAME!);


  // This
  // await indexDocument(uniswapGitbooks[0], index)
  
  const inputchunk:Array<String|undefined> =["The Internet of Things offers many opportunities to grow the economy and improve quality of life. Just as the public sector was instrumental in enabling the development and deployment of the Internet, it must play a similar role to ensure the success of the Internet of Things. Therefore, national governments should create comprehensive national strategies for the Internet of Things to ensure that the technology develops cohesively and rapidly, that consumers and businesses do not face barriers to adoption, and that both the private and public sector take full advantage of the coming wave of smart devices.","The Internet has turned our existence upside down. It has revolutionized communications, to the extent that it is now our preferred medium of everyday communication. In almost everything we do, we use the Internet. Ordering a pizza, buying a television, sharing a moment with a friend, sending a picture over instant messaging. Before the Internet, if you wanted to keep up with the news, you had to walk down to the newsstand when it opened in the morning and buy a local edition reporting what had happened the previous day."]
  const outputchunk:Array<String|undefined> =[]
  
  async function generateSummary(chunk:String|undefined){
    const prompt = `${chunk}\n\nTl;dr`;
    const response = await openai.createCompletion({
      model: "text-davinci-003",
  prompt: prompt,
  temperature: 0,
  max_tokens: 60,
  top_p: 1.0,
  frequency_penalty: 0.0,
  presence_penalty: 0.0,
    });
    console.log(response);
    const summary:String | undefined = response.data.choices[0].text?.trim()
    return summary
  
  }

async function createOutput(){

await inputchunk.map(async(chunk)=>{
    
    const output = await generateSummary(chunk)
    console.log("this is the output:",output?.substring(2));
   await outputchunk.push(output?.substring(2));
    })
  summarizer()
}

function summarizer(){
  const initialSummary = outputchunk.join(" ")
  const finalSummary =  generateSummary(initialSummary);

  console.log(`this is initial summary:`,initialSummary)
  console.log(`this is final summary:`,finalSummary);
}

createOutput();
      
}
createSummary();





