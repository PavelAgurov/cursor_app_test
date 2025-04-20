import { ChatOpenAI } from "@langchain/openai";
import { createHRPolicyTool } from "./tools/hrPolicyTool";
import { ChatPromptTemplate } from "@langchain/core/prompts";
import dotenv from 'dotenv';
import { SYSTEM_PROMPT_WITH_TOOLS, SYSTEM_PROMPT_RAG } from "./prompt/prompts";

// Load environment variables from .env file
dotenv.config();

// Check if required env variables are present
function validateEnvVars() {
  const requiredVars = ['OPENAI_API_KEY', 'LLM_MODEL', 'LLM_TEMPERATURE', 'LLM_MAX_TOKENS'];
  
  for (const variable of requiredVars) {
    if (!process.env[variable]) {
      throw new Error(`Required environment variable ${variable} is not set!`);
    }
  }
}

// Initialize chat model
function initChatModel() {
  validateEnvVars();
  
  return new ChatOpenAI({
    openAIApiKey: process.env.OPENAI_API_KEY,
    modelName: process.env.LLM_MODEL,
    temperature: parseFloat(process.env.LLM_TEMPERATURE || '0.0'),
    maxTokens: parseInt(process.env.LLM_MAX_TOKENS || '1000'),
  });
}

// Create the LLM and tools
const model = initChatModel();
const hrPolicyTool = createHRPolicyTool();
const tools = [hrPolicyTool];

// Create a prompt templates
const promptTemplateWithTools = ChatPromptTemplate.fromTemplate(SYSTEM_PROMPT_WITH_TOOLS);
const promptTemplateRAG       = ChatPromptTemplate.fromTemplate(SYSTEM_PROMPT_RAG);

// Create the model with tools bound to it
const modelWithTools = model.bind({
  tools
});


/**
 * Process a chat message using LangChain and the LLM
 * @param message The user's message
 * @returns The AI response
 */
export async function processChatMessage(message: string): Promise<string> {
  try {
    // Format the prompt
    const formattedPromptWithTools = await promptTemplateWithTools.invoke({
      input: message
    });

    console.log(`processChatMessage: ${message}`);
    
    // Get response from model with tools
    const response = await modelWithTools.invoke(formattedPromptWithTools);
    
    if (response === null) {
      throw new Error('Received null response from model');
    }

    console.log(`LLM Response received: ${typeof response}`);

    // If the response does not contain tool calls, return the response directly
    if (!response.tool_calls || response.tool_calls.length == 0){
      console.log(`No tools needed - return answer from model`)
      return response.text;
    }

    console.log(`Tool calls: ${JSON.stringify(response.tool_calls)}`);
    // If the response contains tool calls, process them
    const toolCall = response.tool_calls[0];
    const toolResponse = await hrPolicyTool.invoke({ query: toolCall.args.query });
    console.log(`Tool response: ${toolResponse}`);
    
    const formattedPromptRAG = await promptTemplateRAG.invoke({
      input: message,
      documents: toolResponse
    });

    const responseRAG = await model.invoke(formattedPromptRAG);
    console.log(`RAG Response: ${responseRAG}`);

    return responseRAG.text;
  } catch (error) {
    console.error('Error processing message with LLM:', error);
    throw new Error('Failed to process your message. Please try again later.');
  }
}
