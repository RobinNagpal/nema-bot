import { PageMetadata } from '@/contents/projectsContents';
import { extractUrls } from '@/prompts/generateGuide/extractContentFromInputString';
import { getImportantContentUsingCheerio } from '@/prompts/generateGuide/getImportantContentUsingCheerio';
import { getImportantPointsBasedOnDirections } from '@/prompts/generateGuide/getImportantPointsBasedOnDirections';
import { impermanentLossGuideDirections, impermanentLossGuideString } from '@/prompts/generateGuide/guideStringExamples';
import { createImportantPoints, generateImportantPoints,createSummary,createImportantQuestions } from '@/prompts/summarize/createSummary';
import dotenv from 'dotenv';
import { Document as LGCDocument } from 'langchain/document';
import { Configuration, OpenAIApi } from 'openai';
import { RecursiveCharacterTextSplitter } from "langchain/text_splitter";
import {split} from "@/loaders/splitter"
import { storeLangDocs,getRelevantContent } from '@/prompts/generateGuide/pineconeFunctions';

dotenv.config();

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});


const openai = new OpenAIApi(configuration);

export async function generateGuide(guideInput: string, directions?: string) {
  // Step 1: Extract the contents from the input string and creating an array of contents
  const guideContents: LGCDocument<PageMetadata>[] = [];
  // const content = extractStringContentWithoutUrls(impermanentLossGuideString);
  // guideContents.push(content);

  const urls = extractUrls(guideInput);

  for (const url of urls) {
    const articleContent = '';
    // const articleContent = await getImportantContentUsingCheerio(url);

    const articleDoc: LGCDocument<PageMetadata> = new LGCDocument<PageMetadata>({
      pageContent: articleContent,
      metadata: { source: url, url: url, fullContent: articleContent, chunk: articleContent },
    });

    guideContents.push(articleDoc);
  }

  const contents = guideContents.map((content) => content.metadata.fullContent);
  // let importantPoints = await createImportantPoints(contents);
  let importantPoints = [
    'Important Points: ',
    '- Uniswap V3 introduces concentrated liquidity positions, amplifying gains and losses of the position as well as trading fee share, but also increasing impermanent loss. ',
    '- Impermanent loss is calculated as a percentage change between the value of the initial holding in terms of asset Y, and the value of the holding if kept outside of the pool. ',
    '- A study by Bancor team found that impermanent losses out shadowed returns earned from trading fees. ',
    '- Market making is a complex activity with risk of losing money during large and sustained movement in underlying asset price compared to simply holding an asset. ',
    '- 0.3% of all trade volume is distributed proportionally to all liquidity providers. ',
    '- Uniswap uses a formula to govern trading which can lead to missed profits due to directional movements without knowing amount of in-between trades.  ',
    '- Flovtec provides market making solutions for digital assets designed to reduce impermanent loss on Uniswap V3 and other DEXs.  ',
    '- Clipper has beaten impermanent loss by running more sophisticated AMMs than CPMM and closely tracking zero cost Daily Rebalancing Portfolio (DRP).  ',
    '- Liquidity providers can offset IL risks through buying/selling crypto options or using perpetual futures contracts or options which come in both call/put flavors and carry no risk of liquidation.  ',
    '- Options provide more value than regular investor: increasing profitability of liquidity pool, lower risks when adding liquidity for risky instruments, higher yield farming APYs while keeping protocol sustainable.',
  ];
  console.log('importantPoints Before Directions: ', importantPoints);

  if (directions) {
    importantPoints = await getImportantPointsBasedOnDirections(openai, importantPoints.join('\n\n'), directions);
  }

  console.log('importantPoints: ', importantPoints);

  return;
  // Step 2: Generate LangChain Docs from the array of contents. Make sure to divide the contents into smaller chunks

async  function generateEmbeddingsAndStore(guideContents: LGCDocument<PageMetadata>[]){
 const splittedDocs = await split(guideContents);
await storeLangDocs(splittedDocs);
}


  // console.log('LangChain Docs:', langChainDocs);

  // Step 3: Generate important points from the array of contents. We already have code for this.

  // const ImportantPoints = await generateImportantPoints(guideContents.join(' '));
  // console.log('importantPoints: ', ImportantPoints);

  // Step 4: If user gives direction, update the important points with the direction.

  // const direction = impermanentLossGuideDirections.split('\n');
  // const updatedImportantPoints = direction ? [...ImportantPoints, ...direction] : ImportantPoints;

  // Step 5: For each of the important points, go to pinecone and find the matching content
  // Step 6: Generate a summary of the matching content by giving all the matching content to the OpenAI API
 


async function getMatchingSummary(importantPoint:string){
  const contents:string[] =[]
  const docs = await  getRelevantContent(importantPoint);
  docs.map((doc)=>{
    contents.push(doc.pageContent);
  })
  
  const summary = await createSummary(contents);
  return summary

}


 
 // Step 7: Do this for each of the important points



async function getAllSummaryAndQuestions(importantPoints:string[]){
  const finalSummaries: Array<string> = []
 await importantPoints.map(async(importantPoint)=>{
    const summary = await getMatchingSummary(importantPoint);
    finalSummaries.push(summary);
  })

  const allQuestions = await createImportantQuestions(finalSummaries)
}



  // Step 8: Save all these new summaries of important points in a new array. This size of this array should be between 3-6

  // Step 8: Generate questions from the summary present in the array.



  // Step 9: Combine questions and summaries to create a guide.

  // Step 10: Return the guide.
}

generateGuide(impermanentLossGuideString, impermanentLossGuideDirections);
