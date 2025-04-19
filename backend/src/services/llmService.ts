import { ChatOpenAI } from "@langchain/openai";
import { HumanMessage, SystemMessage } from "@langchain/core/messages";
import dotenv from 'dotenv';

// Load environment variables from .env file
dotenv.config();

// Check if required env variables are present
function validateEnvVars() {
  const requiredVars = ['OPENAI_API_KEY', 'LLM_MODEL', 'LLM_TEMPERATURE', 'LLM_MAX_TOKENS', 'SYSTEM_PROMPT'];
  
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
    temperature: parseFloat(process.env.LLM_TEMPERATURE || '0.7'),
    maxTokens: parseInt(process.env.LLM_MAX_TOKENS || '150'),
  });
}

// Initialize chat model
const model = initChatModel();
const systemPrompt = process.env.SYSTEM_PROMPT || '';

/**
 * Process a chat message using LangChain and the LLM
 * @param message The user's message
 * @returns The AI response
 */
export async function processChatMessage(message: string): Promise<string> {
  try {
    // Create messages array with system prompt and user message
    const messages = [
      new SystemMessage(systemPrompt),
      new HumanMessage(message)
    ];
    
    // Get response from model
    const response = await model.invoke(messages);
    
    return response.content.toString();
  } catch (error) {
    console.error('Error processing message with LLM:', error);
    throw new Error('Failed to process your message. Please try again later.');
  }
} 