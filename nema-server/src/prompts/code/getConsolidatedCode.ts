import { templates } from '@/templates';
import { OpenAI } from 'langchain/llms/openai';
import { PromptTemplate } from 'langchain/prompts';

export async function getConsolidatedCode(inquiry: string, fullDocuments: string): Promise<string> {
  const promptTemplate = new PromptTemplate({
    template: templates.codeTemplate,
    inputVariables: ['inquiry', 'original_documents', 'language1', 'language2', 'framework1', 'framework2'],
  });

  const model = new OpenAI({
    openAIApiKey: process.env.OPENAI_API_KEY,
    verbose: true,
    modelName: 'gpt-3.5-turbo',
  });

  const formattedPrompt = await promptTemplate.format({
    inquiry,
    original_documents: fullDocuments,
    language1: 'solidity',
    language2: 'typescript',
    framework1: 'openzeppelin',
    framework2: 'hardhat',
  });

  console.log('populatedPrompt', formattedPrompt);

  const result = await model.call(formattedPrompt.slice(2048, 4096));

  console.log('result', result);
  return result;
}
