import { LLMChain, PromptTemplate } from 'langchain';
import { OpenAI } from 'langchain/llms';
import { templates } from './templates';

const codeTemplate = `CONTENT provides the source code around which we need to generate new code examples. You should follow these rules when generating code examples:
    
    - Use the source code in CONTENT as the basis for generating the examples. All examples should relate to or use the functions provided in CONTENT.
    
    - Choose the most relevant framework or language for generating the examples. You can use any of the following frameworks:
        
        - Framework_1
        - Framework_2
        - Framework_3
    
    - Generate code examples that are relevant to the INQUIRY provided. If the inquiry cannot be answered, the final answer should be empty.
    
    - All generated code examples should be valid and functional, and should demonstrate the use of the functions provided in CONTENT.
    
    - Provide comments or explanations for each code example to make it easier to understand and use.
    
    - Each code example should be presented in markdown format.
    
    INQUIRY: {inquiry}    
    CONTENT: {original_documents}
    FRAMEWORK_1: {framework1}
    FRAMEWORK_2: {framework2}
    FRAMEWORK_3: {framework3}

    Final answer:
`;

const llm = new OpenAI({ concurrency: 10, temperature: 0, modelName: 'gpt-3.5-turbo' });

const promptTemplate = new PromptTemplate({
  template: codeTemplate,
  inputVariables: ['original_documents', 'inquiry'],
});

const chunkSubstr = (str: string, size: number) => {
  const numChunks = Math.ceil(str.length / size);
  return Array.from({ length: numChunks }, (_, i) => str.substring(i * size, (i + 1) * size));
};

const summarize = async (document: string, inquiry: string, onSummaryDone: Function) => {
  const chain = new LLMChain({
    prompt: promptTemplate,
    llm,
  });

  try {
    const result = await chain.call({
      prompt: promptTemplate,
      document,
      inquiry,
    });

    onSummaryDone(result.text);
    return result.text;
  } catch (e) {
    console.log(e);
  }
};

const summarizeLongDocument = async (document: string, inquiry: string, onSummaryDone: Function): Promise<string> => {
  // Chunk document into 4000 character chunks
  try {
    if (document.length > 3000) {
      const chunks = chunkSubstr(document, 4000);
      let summarizedChunks: string[] = [];
      for (const chunk of chunks) {
        const result = await summarize(chunk, inquiry, onSummaryDone);
        summarizedChunks.push(result);
      }

      const result = summarizedChunks.join('\n');

      if (result.length > 4000) {
        return await summarizeLongDocument(result, inquiry, onSummaryDone);
      } else return result;
    } else {
      return document;
    }
  } catch (e) {
    throw new Error(e as string);
  }
};

export { summarizeLongDocument };
