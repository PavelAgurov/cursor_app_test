import dotenv from 'dotenv';

import { ChatOpenAI } from "@langchain/openai";
import { ChatPromptTemplate } from "@langchain/core/prompts";

import { createHRPolicyTool } from "./tools/hrPolicyTool";
import { createPersonalInfoTool } from "./tools/personalInfoTool";
import { createVacationRequestTool } from "./tools/vacationRequestTool";

import { SYSTEM_PROMPT_WITH_TOOLS, SYSTEM_PROMPT_RAG, MULTI_RESPONSE_SUMMARY_PROMPT } from "./prompt/prompts";

import { markdownToHtml, getFormattedDate } from "../utils";

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
const vacationRequestTool = createVacationRequestTool();
const tools = [hrPolicyTool, personalInfoTool, vacationRequestTool];

// Create a prompt templates
const promptTemplateWithTools = ChatPromptTemplate.fromTemplate(SYSTEM_PROMPT_WITH_TOOLS);
const promptTemplateRAG = ChatPromptTemplate.fromTemplate(SYSTEM_PROMPT_RAG);
const summaryPromptTemplate = ChatPromptTemplate.fromTemplate(MULTI_RESPONSE_SUMMARY_PROMPT);

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
    // Get current date in a readable format
    const currentDate = getFormattedDate();
    
    // Format the prompt
    const formattedPromptWithTools = await promptTemplateWithTools.invoke({
      input: message,
      name: username,
      current_date: currentDate,
      hr_policy_tool_name: hrPolicyTool.name,
      personal_info_tool_name: personalInfoTool.name,
      vacation_request_tool_name: vacationRequestTool.name
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
      console.log(`No tools needed - return answer from model`);
      return markdownToHtml(response.text);
    }

    console.log(`Tool calls: ${JSON.stringify(response.tool_calls)}`);
    
    // Process multiple tool calls and collect responses
    const toolResponses: string[] = [];
    const toolUsedList : string[] = [];
    let ragResponse = '';
    
    // Process each tool call
    for (const toolCall of response.tool_calls) {
      console.log(`Processing tool call: ${toolCall.name}`);
      console.log(`Tool call args: ${JSON.stringify(toolCall.args)}`);
    
      // Handle personal info query tool
      if (toolCall.name === personalInfoTool.name) {
        const toolArgs = toolCall.args;
        const toolResponse = await personalInfoTool.invoke({ 
          username: toolArgs.username || username, 
          infoType: toolArgs.infoType,
          currentUser: username
        });
        console.log(`Personal info tool response: ${toolResponse}`);
        toolResponses.push(toolResponse);
        toolUsedList.push(`Personal info tool`);
      }
      
      // Handle vacation request tool
      else if (toolCall.name === vacationRequestTool.name) {
        const toolArgs = toolCall.args;
        const toolResponse = await vacationRequestTool.invoke({
          username: toolArgs.username || username,
          startDate: toolArgs.startDate,
          endDate: toolArgs.endDate,
          duration: toolArgs.duration,
          durationUnit: toolArgs.durationUnit,
          currentUser: username
        });
        console.log(`Vacation request tool response: ${toolResponse}`);
        toolResponses.push(toolResponse);
        toolUsedList.push(`Vacation request tool`);
      }
      
      // Handle HR policy tool
      else if (toolCall.name === hrPolicyTool.name) {
        const toolResponse = await hrPolicyTool.invoke({ query: toolCall.args.query });
        console.log(`HR Policy tool response: ${toolResponse}`);
        
        const formattedPromptRAG = await promptTemplateRAG.invoke({
          input: message,
          documents: toolResponse,
          name: username,
          current_date: currentDate
        });

        const responseRAG = await model.invoke(formattedPromptRAG);
        console.log(`RAG Response: ${responseRAG}`);

        ragResponse = responseRAG.text;
        // For HR policy, we use RAG instead of direct tool response
        toolResponses.push(ragResponse);
        toolUsedList.push(`HR policy tool`);
      }
      else {
        // Unknown tool
        console.log(`Unknown tool call: ${toolCall.name}`);
        toolResponses.push(`I'm sorry, I don't know how to handle the request: ${toolCall.name}.`);
      }
    }

    // No successful tool responses
    if (toolResponses.length === 0) {
      return markdownToHtml(`I'm sorry, I'm not able to process your request right now.`);
    }
    
    const usedTools = `*Generated by [${toolUsedList.join(", ")}]*`;
    console.log(`Used tools: ${usedTools}`);

    // If we only have one response, return it directly
    if (toolResponses.length === 1) {
      const answer =  `${toolResponses[0]} \n\n ${usedTools}`;
      return markdownToHtml(answer);
    }
    
    // Combine multiple responses into a coherent answer
    const combinedResponse = toolResponses.join("\n\n");
    console.log(`Combined response from ${toolResponses.length} tool calls: ${combinedResponse}`);
    
    // For multiple responses, generate a summary that combines them
    if (toolResponses.length > 1) {
      // Create a prompt to summarize multiple tool responses using the template
      const summaryPrompt = await summaryPromptTemplate.invoke({
        results: combinedResponse
      });
      
      // Get a summary response from the model
      const summaryResponse = await model.invoke(summaryPrompt);
      console.log(`Summary response: ${summaryResponse.text}`);
      
      const answer =  `${summaryResponse.text} \n\n ${usedTools}`;
      return markdownToHtml(answer);
    }
    
    return markdownToHtml(combinedResponse);
  } catch (error) {
    console.error('Error processing message with LLM:', error);
    throw new Error('Failed to process your message. Please try again later.');
  }
}
