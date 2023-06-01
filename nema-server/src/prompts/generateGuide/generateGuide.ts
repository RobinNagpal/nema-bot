import { extractStringContentWithoutUrls, extractUrls } from '@/prompts/generateGuide/extractContentFromInputString';
import { getImportantContentUsingCheerio } from '@/prompts/generateGuide/getImportantContentUsingCheerio';
import { impermanentLossGuideString,impermanentLossGuideDirections } from '@/prompts/generateGuide/guideStringExamples';
import {generateImportantPoints} from '@/prompts/summarize/createSummary'



export async function generateGuide() {
  // Step 1: Extract the contents from the input string and creating an array of contents
  const guideContents: string[] = [];
  const content = extractStringContentWithoutUrls(impermanentLossGuideString);
  guideContents.push(content);
  const urls = extractUrls(impermanentLossGuideString);
  
  for (const url of urls) {
    const importantContents = await getImportantContentUsingCheerio(url);
    
    guideContents.push(importantContents);
  }



  // Step 2: Generate LangChain Docs from the array of contents. Make sure to divide the contents into smaller chunks
  
  // const chunkSize = 2000; // Set the desired chunk size
  // const langChainDocs: string[] = [];
  
  // for (const content of guideContents) {
  //   const chunks = content.match(new RegExp(`.{1,${chunkSize}}`, 'g'));
  //   if (chunks) {
  //     langChainDocs.push(...chunks);
  //   }
  // }

  // console.log('LangChain Docs:', langChainDocs);



  // Step 3: Generate important points from the array of contents. We already have code for this.
  
  const ImportantPoints = await generateImportantPoints(guideContents.join(' '))
  console.log("importantPoints: ",ImportantPoints);


  // Step 4: If user gives direction, update the important points with the direction.

  const direction = impermanentLossGuideDirections.split('\n');
  const updatedImportantPoints = direction ? [...ImportantPoints, ...direction] : ImportantPoints;



  // Step 5: For each of the important points, go to pinecone and find the matching content
  // Step 6: Generate a summary of the matching content by giving all the matching content to the OpenAI API
  // Step 7: Do this for each of the important points




  // Step 8: Save all these new summaries of important points in a new array. This size of this array should be between 3-6

  // Step 8: Generate questions from the summary present in the array.

  // Step 9: Combine questions and summaries to create a guide.

  // Step 10: Return the guide.
}

generateGuide()