import { templates } from '@/templates';
import { LLMChain } from 'langchain';
import { ChatOpenAI } from 'langchain/chat_models';
import { PromptTemplate } from 'langchain/prompts';
import { ChainValues } from 'langchain/schema';

export async function getRelevantCode(userPrompt: string, codeChunk: string): Promise<string> {
  const chat = new ChatOpenAI({
    openAIApiKey: process.env.OPENAI_API_KEY,
    verbose: false,
    modelName: 'gpt-3.5-turbo',
    temperature: 1.2,
  });

  const promptTemplate = new PromptTemplate({
    template: templates.relevantCodeInquiryTemplate,
    inputVariables: ['userPrompt', 'codeChunk'],
  });

  const chain = new LLMChain({
    prompt: promptTemplate,
    llm: chat,
  });

  const result: ChainValues = await chain.call({
    userPrompt: 'testing swap function',
    codeChunk,
  });

  return result['text'];
}
