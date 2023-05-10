const templates = {
  qaTemplate: `Answer the question based on the context below. You should follow ALL the following rules when generating and answer:
        - There will be a CONVERSATION LOG, CONTEXT, and a QUESTION.
        - The final answer must always be styled using markdown.
        - Your main goal is to point the user to the right source of information (the source is always a URL) based on the CONTEXT you are given.
        - Your secondary goal is to provide the user with an answer that is relevant to the question.
        - Provide the user with a code example that is relevant to the question, if the context contains relevant code examples. Do not make up any code examples on your own.
        - Take into account the entire conversation so far, marked as CONVERSATION LOG, but prioritize the CONTEXT.
        - Based on the CONTEXT, choose the source that is most relevant to the QUESTION.
        - Do not make up any answers if the CONTEXT does not have relevant information.
        - Use bullet points, lists, paragraphs and text styling to present the answer in markdown.
        - The CONTEXT is a set of JSON objects, each includes the field "text" where the content is stored, and "url" where the url of the page is stored.
        - The URLs are the URLs of the pages that contain the CONTEXT. Always include them in the answer as "Sources" or "References", as numbered markdown links.
        - Do not mention the CONTEXT or the CONVERSATION LOG in the answer, but use them to generate the answer.
        - ALWAYS prefer the result with the highest "score" value.
        - Ignore any content that is stored in html tables.
        - The answer should only be based on the CONTEXT. Do not use any external sources. Do not generate the response based on the question without clear reference to the context.
        - Summarize the CONTEXT to make it easier to read, but don't omit any information.
        - It is IMPERATIVE that any link provided is found in the CONTEXT. Prefer not to provide a link if it is not found in the CONTEXT.

        CONVERSATION LOG: {conversationHistory}

        CONTEXT: {summaries}

        QUESTION: {question}

        URLS: {urls}

        Final Answer: `,
  summarizerTemplate: `Shorten the text in the CONTENT, attempting to answer the INQUIRY. You should follow the following rules when generating the summary:
    - Any code found in the CONTENT should ALWAYS be preserved in the summary, unchanged.
    - Code will be surrounded by backticks (\`) or triple backticks (\`\`\`).
    - Summary should include code examples that are relevant to the INQUIRY, based on the content. Do not make up any code examples on your own.
    - The summary will answer the INQUIRY. If it cannot be answered, the summary should be empty.
    - If the INQUIRY cannot be answered, the final answer should be empty.
    - The summary should be under 4000 characters.

    INQUIRY: {inquiry}
    CONTENT: {document}

    Final answer:
    `,
  inquiryTemplate: `Given the following user prompt and conversation log, formulate a question that would be the most relevant to provide the user with an answer from a knowledge base.
    You should follow the following rules when generating and answer:
    - Always prioritize the user prompt over the conversation log.
    - Ignore any conversation log that is not directly related to the user prompt.
    - Only attempt to answer if a question was posed.
    - The question should be a single sentence
    - You should remove any punctuation from the question
    - You should remove any words that are not relevant to the question
    - If you are unable to formulate a question, respond with the same USER PROMPT you got.

    USER PROMPT: {userPrompt}

    CONVERSATION LOG: {conversationHistory}

    Final answer:
    `,
  statelessCodeInquiryTemplate: `Given the following user prompt, find all the code snippets that matches to the user's prompt.
    You should follow the following rules when generating and answer:
    - Only attempt to answer if a there is a close match.
    - Return the solidity or typescript code that matches the user prompt.
    - You should remove any code that  is not relevant to the user prompt
    - If you are unable to formulate a question, respond: I WAS NOT ABLE TO FIND ANYTHING RELEVANT.

    USER PROMPT: {userPrompt}

    Final answer:
    `,
  codeTemplate: `CONTENT provides the source code around which we need to generate new code examples. You should follow these rules when generating code examples:
    
    - Use the source code in CONTENT as the basis for generating the examples. All examples should relate to or use the functions provided in CONTENT.

    - CONTENT also contains relevant text which you can use to understand the concept and explain it using code examples.

    - When you generate the code examples and test cases, try to be exhaustive in it and cover all the possible cases.
    
    - Choose the most relevant framework or language for generating the examples. LANGUAGES contains some of the languages and frameworks you can use to get started with but don't consider them exchaustive, they are to help you. You can use any of the frameworks and languages provided in LANGUAGES.
    
    - Generate code examples that are relevant to the INQUIRY provided. If the inquiry cannot be answered, the final answer should be empty.
    
    - All generated code examples should be valid and functional, and should demonstrate the use of the functions provided in CONTENT.
    
    - Provide comments or explanations for each code example to make it easier to understand and use.
    
    - Each code example should be presented in markdown format.
    
    INQUIRY: {inquiry}    
    
    CONTENT: {original_documents}

    LANGUAGES: {languages}
    
    Final answer:
    `,
};

export { templates };
