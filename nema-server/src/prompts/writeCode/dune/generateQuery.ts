import fs from 'fs';
import { ChatOpenAI } from 'langchain/chat_models';
import { LLMChain } from 'langchain';
import { PromptTemplate } from 'langchain/prompts';
import dotenv from 'dotenv';

dotenv.config();

const generateSqlTemplate = `
Given a JSON representation of a SQL schema, generate the corresponding SQL query.

The query should strictly adhere to the provided JSON schema. Do not include any variables or types that are not present in the schema.

Make sure the queries are postgres compatible.

Use the correct table names, column names, and data types based on the JSON schema. The table name should be derived from the 'name' attribute present in the JSON schema.

For instance, to query all values from a table passed in JSON SCHEMA, it would be like:
SELECT * FROM {tableName}

**Prompt:**
{prompt}

**JSON Schema:**
{contextFile}

**SQL Output:**`;

//const filePath1 = './generated_json/myfile.json';  
//const prompt1="List down all the Pools in decending order by total asset value";

// const filePath2 = './generated_json/dex.trades.json'; 
// const prompt2="List down all the pools in descending order by total volume in last 24 hours";
// const modifiedPrompt2 = `
// Write a SQL query to list all the pairs of tokens (token_sold_symbol and token_bought_symbol) in trades on the Ethereum blockchain from the table, 
// calculating the total trading volume in USD (amount_usd) for each pair in the last 24 hours. 
// Order the results in descending order by this total trading volume.
// `;

const filePath3 = './generated_json/uniswap_v2_ethereum.Pair_evt_Swap.json'; 
// const prompt3="List down unique users doing swaps in last 24 hrs, 3d, 7d, 14d, 30d"
const modifiedPrompt3=`Write a SQL query to count the number of unique users, who made swaps in the last 24 hours.`

// const filePath4 = './generated_json/myfile.json'; 
// const prompt4="List down how many people have UNI tokens from this list"

// const duneNinjaPrompt="The volume on sushiswap in the past 30 days"

function fetchFile(filePath: string): string {
    const data = fs.readFileSync(filePath, 'utf-8');
    return data;
}

async function getRelevantSQL(filePath: string): Promise<void> {
    const chat = new ChatOpenAI({
        openAIApiKey: process.env.OPENAI_API_KEY,
        verbose: false,
        modelName: 'gpt-3.5-turbo',
        temperature: 1.2,
    });

    console.log(`Processing file: ${filePath}`)
    const contextFile = fetchFile(filePath);
    const obj = JSON.parse(contextFile);  // parse JSON string back into object

    // extract the table name from the JSON schema
    const tableName = obj.tables[0].name;
    
    const promptTemplate = new PromptTemplate({
        template: generateSqlTemplate,
        inputVariables: ['tableName', 'prompt', 'contextFile'],
    });

    const chain = new LLMChain({
        prompt: promptTemplate,
        llm: chat,
    });

    const result = await chain.call({tableName, prompt:modifiedPrompt3, contextFile});

    console.log('\n==================================================\n');
    console.log(result['text']);
    console.log('\n==================================================\n');
}

getRelevantSQL(filePath3).catch(console.error);
