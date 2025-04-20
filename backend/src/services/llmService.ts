import { ChatOpenAI } from "@langchain/openai";
import { createHRPolicyTool } from "./tools/hrPolicyTool";
import { createPersonalInfoTool } from "./tools/personalInfoTool";
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
const personalInfoTool = createPersonalInfoTool();
const tools = [hrPolicyTool, personalInfoTool];

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
 * @param username The username of the person sending the message
 * @returns The AI response
 */
export async function processChatMessage(message: string, username: string = 'anonymous'): Promise<string> {
  try {
    // Format the prompt
    const formattedPromptWithTools = await promptTemplateWithTools.invoke({
      input: message,
      name: username
    });

    console.log(`processChatMessage from ${username}: ${message}`);
    
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
    
    // Handle personal info query tool
    if (toolCall.name === "personal_info_query") {
      const toolArgs = toolCall.args;
      const toolResponse = await personalInfoTool.invoke({ 
        username: toolArgs.username || username, 
        infoType: toolArgs.infoType,
        currentUser: username
      });
      console.log(`Personal info tool response: ${toolResponse}`);
      return toolResponse;
    }
    
    // Handle HR policy tool
    if (toolCall.name === "hr_policy_query") {
      const toolResponse = await hrPolicyTool.invoke({ query: toolCall.args.query });
      console.log(`HR Policy tool response: ${toolResponse}`);
      
      const formattedPromptRAG = await promptTemplateRAG.invoke({
        input: message,
        documents: toolResponse,
        name: username
      });

      const responseRAG = await model.invoke(formattedPromptRAG);
      console.log(`RAG Response: ${responseRAG}`);

      return responseRAG.text;
    }
    
    // If tool not recognized
    return `I'm sorry, I'm not able to process that request right now.`;
  } catch (error) {
    console.error('Error processing message with LLM:', error);
    throw new Error('Failed to process your message. Please try again later.');
  }
}
