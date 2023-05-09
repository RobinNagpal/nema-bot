import { templates } from '@/templates';
import { CallbackManager } from 'langchain/callbacks';
import { LLMChain } from 'langchain/chains';
import { ChatOpenAI } from 'langchain/chat_models/openai';
import { PromptTemplate } from 'langchain/prompts';
import { ChainValues } from 'langchain/schema';

export async function getConsolidatedCode(inquiry: string, fullDocuments: string): Promise<ChainValues> {
  const promptTemplate = new PromptTemplate({
    template: templates.codeTemplate,
    inputVariables: ['inquiry', 'original_documents', 'language1', 'language2', 'framework1', 'framework2'],
  });

  const chat = new ChatOpenAI({
    openAIApiKey: process.env.OPENAI_API_KEY,
    verbose: true,
    modelName: 'gpt-3.5-turbo',
  });

  const chain = new LLMChain({
    prompt: promptTemplate,
    llm: chat,
  });

  const result = await chain.call({
    inquiry,
    original_documents: fullDocuments,
    language1: 'solidity',
    language2: 'typescript',
    framework1: 'openzeppelin',
    framework2: 'hardhat',
  });

  return result;
}
