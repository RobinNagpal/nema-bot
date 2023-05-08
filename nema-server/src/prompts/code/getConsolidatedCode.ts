import { templates } from '@/templates';
import { CallbackManager } from 'langchain/callbacks';
import { LLMChain } from 'langchain/chains';
import { ChatOpenAI } from 'langchain/chat_models/openai';
import { PromptTemplate } from 'langchain/prompts';
import { ChainValues } from 'langchain/schema';

export async function getConsolidatedCode(inquiry: string, fullDocuments: string[]): Promise<ChainValues> {
  const promptTemplate = new PromptTemplate({
    //   template: templates.qaTemplate,
    template: templates.codeTemplate,
    inputVariables: ['inquiry', 'original_documents', 'framework1', 'framework2', 'framework3'],
    //   inputVariables: ['summaries', 'question', 'conversationHistory', 'urls'],
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
    //   summaries: summary,
    inquiry,
    original_documents: fullDocuments.join('\n'),
    framework1: 'solidity',
    framework2: 'typescript',
    framework3: 'javascript',
  });

  return result;
}
