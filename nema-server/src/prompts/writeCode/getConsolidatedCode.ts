import { templates } from '@/templates';
import { OpenAI } from 'langchain/llms/openai';
import { PromptTemplate } from 'langchain/prompts';

export async function getConsolidatedCode(inquiry: string, fullDocuments: string): Promise<string> {
  const languages = ['solidity', 'typescript', 'openzeppelin', 'hardhat'];

  const promptTemplate = new PromptTemplate({
    template: templates.codeTemplate,
    inputVariables: ['inquiry', 'original_documents', 'languages'],
  });

  const model = new OpenAI({
    openAIApiKey: process.env.OPENAI_API_KEY,
    verbose: true,
    modelName: 'gpt-3.5-turbo',
  });

  const formattedPrompt = await promptTemplate.format({
    inquiry,
    original_documents: fullDocuments,
    languages: languages,
  });

  // console.log('populatedPrompt', formattedPrompt);

  const result = await model.call(formattedPrompt.slice(2048, 4096));

  // console.log('result', result);
  return result;
}
