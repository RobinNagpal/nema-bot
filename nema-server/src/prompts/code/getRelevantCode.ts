import { templates } from '@/templates';
import { OpenAI } from 'langchain/llms/openai';
import { PromptTemplate } from 'langchain/prompts';

export async function getRelevantCode(userPrompt: string, fullDocument: string): Promise<string> {
  const promptTemplate = new PromptTemplate({
    template: templates.relevantCodeInquiryTemplate,
    inputVariables: ['userPrompt', 'fullDocument'],
  });

  const model = new OpenAI({
    openAIApiKey: process.env.OPENAI_API_KEY,
    verbose: true,
    modelName: 'gpt-3.5-turbo',
    temperature: 1,
  });

  const formattedPrompt = await promptTemplate.format({
    userPrompt: 'Give me the most relevant code for swapping from the provided code snippet.',
    fullDocument,
  });

  // console.log('populatedPrompt', formattedPrompt);

  // console.log('result', result);
  return await model.call(formattedPrompt);
}
