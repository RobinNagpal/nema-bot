// Description: This file is used to parse the SQL schema scripts and convert them into a JSON representation.
import { ChatOpenAI } from "langchain/chat_models";
import { LLMChain } from "langchain";
import { PromptTemplate } from "langchain/prompts";
import dotenv from "dotenv";
import fs from "fs";
import { Octokit } from "octokit";
import { ChainValues } from "langchain/schema";
import path from "path";

dotenv.config();

const sqlTemplate = `
SQL Schema to JSON Converter

Given a context file, the task is to parse the SQL schema scripts and convert them into a MySQL compatible JSON representation. The context file contains SQL table definitions and other related properties.

The SQL schema includes table names, column names, data types, and constraints which should all be incorporated into the JSON format for accurate MySQL query generation.

**JSON Output:**

The JSON output should contain a "tables" array. Each object in the array represents a table and consists of:

- "name": The table name, calculated as schema.alias. If the schema is not present in the configuration, assume the default to be 'uniswap'.
- "columns": An array of column objects, where each object contains:
  - "name": The column name.
  - "type": The data type of the column, but converted to a MySQL compatible type. For example, convert "text" to "varchar(255)" or "numeric" to "decimal" etc.
- "constraints": An array of constraint objects, where each object contains:
  - "column": The name of the column the constraint applies to.
  - "type": The type of the constraint (e.g., 'PRIMARY KEY', 'NOT NULL', 'UNIQUE' etc).

Your task is to parse the given context file and generate the JSON output in the specified format.

**Context:** {contextFile}


**Final Answer:**

`;

const octokit = new Octokit({
  auth: process.env.GITHUB_ACCESS_TOKEN,
});

async function loadGithub(): Promise<string[]> {
  const docs: string[] = [];

  async function processPath(path: string) {
    const response = await octokit.request(
      "GET /repos/{owner}/{repo}/contents/{path}",
      {
        owner: "duneanalytics",
        repo: "spellbook",
        path,
      }
    );

    console.log(`Received response from GitHub for path: ${path}`);

    if (Array.isArray(response.data)) {
      for (const item of response.data) {
        if (item.type === "file") {
            // Only process SQL files and ignore the rest
            if (!item.name.endsWith(".sql")) {
                console.log(`Ignoring file (not SQL): ${item.path}`);
                continue;
            }
            //only process small files with content less than 10000 characters
            if (item.size > 10000) {
                console.log(`Ignoring file (too large): ${item.path}`);
                continue;
            }

          const fileResponse = await octokit.request(
            "GET /repos/{owner}/{repo}/git/blobs/{file_sha}",
            {
              owner: "duneanalytics",
              repo: "spellbook",
              file_sha: item.sha,
            }
          );

          console.log(`Downloaded file: ${item.path}`);

          const fileContent = Buffer.from(
            fileResponse.data.content,
            "base64"
          ).toString("utf-8");
          docs.push(fileContent);

        } else if (item.type === "dir") {
          await processPath(item.path);
        } else {
          console.log(
            `Ignoring item (neither file nor directory): ${item.path}`
          );
        }
      }
    } else {
      console.error("The response data is not an array.");
    }
  }

  await processPath("models/uniswap");

  console.log(
    `Finished loading GitHub data. Total files processed: ${docs.length}`
  );

  return docs;
}

function isValidJson(jsonString: string) {
    try {
      JSON.parse(jsonString);
    } catch (e) {
      return false;
    }
    return true;
  }
  

async function getRelevantJSON(codeChunks: string[]): Promise<void> {
    const chat = new ChatOpenAI({
      openAIApiKey: process.env.OPENAI_API_KEY,
      modelName: "gpt-3.5-turbo",
    });
    const directoryPath = "./generated_json";
    if (!fs.existsSync(directoryPath)) {
      try {
        fs.mkdirSync(directoryPath);
        console.log(`Directory ${directoryPath} created`);
      } catch (error) {
        console.error(`Error creating directory: ${error}`);
      }
    }
  
    for (const codeChunk of codeChunks) {
      const promptTemplate = new PromptTemplate({
        template: sqlTemplate,
        inputVariables: ["contextFile"],
      });
  
      const chain = new LLMChain({
        prompt: promptTemplate,
        llm: chat,
      });
  
      const result: ChainValues = await chain.call({
        contextFile: codeChunk,
      });
  
      const json = result["text"];
  
      // Check that the JSON is valid before proceeding
      if (!isValidJson(json)) {
        console.error(`Invalid JSON encountered: ${json}`);
        continue;
      }
      else console.log("Valid JSON");
  
      const parsedJson = JSON.parse(json);
  

      const fileName = parsedJson.tables[0].name;
      const filePath = path.join(directoryPath, `${fileName}.json`);
      const writer = fs.createWriteStream(filePath);
      writer.write(json, 'utf-8');
      writer.end();
  
      writer.on('finish', function() {
        console.log(`File ${filePath} written successfully`);
      }).on('error', function(err) {
        console.error(`Error writing file ${filePath}:`, err);
      });
    }
  }
  


async function run() {
  try {
    const codechunks = await loadGithub();
    await getRelevantJSON(codechunks);
    console.log("File(s) written successfully");
  } catch (error) {
    console.error("An error occurred:", error);
  }
}

run();
