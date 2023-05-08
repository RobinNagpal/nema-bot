import dotenv from 'dotenv';

dotenv.config();

import { PineconeClient } from '@pinecone-database/pinecone';
import { CallbackManager } from 'langchain/callbacks';
import { LLMChain } from 'langchain/chains';
import { ChatOpenAI } from 'langchain/chat_models/openai';
import { OpenAIEmbeddings } from 'langchain/embeddings/openai';
import { OpenAI } from 'langchain/llms/openai';
import { PromptTemplate } from 'langchain/prompts';

import { ConversationLog } from './conversationLog';
import { Metadata, getMatchesFromEmbeddings } from './matches';
import { templates } from './templates';

const llm = new OpenAI({
  openAIApiKey: process.env.OPENAI_API_KEY,
});
let pinecone: PineconeClient | null = null;

const initPineconeClient = async () => {
  pinecone = new PineconeClient();
  await pinecone.init({
    environment: process.env.PINECONE_ENVIRONMENT!,
    apiKey: process.env.PINECONE_API_KEY!,
  });
};

const handleRequest = async () => {
  if (!pinecone) {
    await initPineconeClient();
  }

  try {
    const prompt = 'Explain the smart contract for uniswap v3 pool';
    const userId = 'user';

    // Retrieve the conversation log and save the user's prompt
    const conversationLog = new ConversationLog(userId);
    const conversationHistory = await conversationLog.getConversation({ limit: 10 });
    await conversationLog.addEntry({ entry: prompt, speaker: 'user' });

    // Build an LLM chain that will improve the user prompt
    const inquiryChain = new LLMChain({
      llm,
      prompt: new PromptTemplate({
        template: templates.inquiryTemplate,
        inputVariables: ['userPrompt', 'conversationHistory'],
      }),
    });
    const inquiryChainResult = await inquiryChain.call({ userPrompt: prompt, conversationHistory });
    const inquiry = inquiryChainResult.text;

    console.log('inquiry:', inquiry);

    // Embed the user's intent and query the Pinecone index
    const embedder = new OpenAIEmbeddings({ openAIApiKey: process.env.OPENAI_API_KEY });

    const embeddings = await embedder.embedQuery(inquiry);

    console.log('embeddings', embeddings.length);
    const matches = await getMatchesFromEmbeddings(embeddings, pinecone!, 500);

    console.log('matches', matches.length);
    // console.log('matches: ', matches);

    // const urls = docs && Array.from(new Set(docs.map(doc => doc.metadata.url)))

    const urls =
      matches &&
      Array.from(
        new Set(
          matches.map((match) => {
            const metadata = match.metadata as Metadata;
            const { url } = metadata;
            return url;
          })
        )
      );

    console.log(urls);

    const fullDocuments =
      matches &&
      Array.from(
        matches.reduce((map, match) => {
          const metadata = match.metadata as Metadata;
          const { text, url } = metadata;
          if (!map.has(url)) {
            map.set(url, text);
          }
          return map;
        }, new Map())
      ).map(([_, text]) => text);

    const chunkedDocs =
      matches &&
      Array.from(
        new Set(
          matches.map((match) => {
            const metadata = match.metadata as Metadata;
            const { chunk } = metadata;
            return chunk;
          })
        )
      );

    // const fullDocuments = urls && await getDocumentsByUrl(urls)
    // console.log('fullDocuments: ', fullDocuments);

    // console.log('chunked docs:', chunkedDocs);

    // Prepare a QA chain and call it with the document summaries and the user's prompt
    const promptTemplate = new PromptTemplate({
      //   template: templates.qaTemplate,
      template: templates.codeTemplate,
      inputVariables: ['inquiry', 'original_documents', 'conversationHistory', 'framework1', 'framework2', 'framework3'],
      //   inputVariables: ['summaries', 'question', 'conversationHistory', 'urls'],
    });

    const chat = new ChatOpenAI({
      openAIApiKey: process.env.OPENAI_API_KEY,
      streaming: true,
      verbose: true,
      modelName: 'gpt-3.5-turbo',
      callbackManager: CallbackManager.fromHandlers({
        async handleLLMNewToken(token) {
          console.log(token);
        },
      }),
    });

    const chain = new LLMChain({
      prompt: promptTemplate,
      llm: chat,
    });

    await chain.call({
      //   summaries: summary,
      inquiry: prompt,
      original_documents: fullDocuments.join('\n'),
      //   original_documents: chunkedDocs,
      conversationHistory: conversationHistory,
      framework1: 'solidity',
      framework2: 'typescript',
      framework3: 'javascript',
    });
  } catch (error) {
    console.error(error);
  }
};

// export default async function handler(req: any, res: any) {
//   const { body } = req;
//   const { prompt, userId } = body;
//   await handleRequest();
//   res.status(200).json({ message: 'started' });
// }

handleRequest();
