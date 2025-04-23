import { z } from "zod";
import { DynamicStructuredTool } from "@langchain/core/tools";
import { HuggingFaceTransformersEmbeddings } from "@langchain/community/embeddings/huggingface_transformers";
import { MemoryVectorStore } from "langchain/vectorstores/memory";
import { Document } from "@langchain/core/documents";
import { HRPolicy, loadHRPolicyData } from '../../dataAccess/hrPolicyAccess';

const DEFAULT_HR_POLICY = "Sorry, I couldn't find specific information about that in our HR policies. Please try asking in a different way or contact HR for more information.";

// Initialize embeddings model with local implementation
const embeddings = new HuggingFaceTransformersEmbeddings({
  model: "Xenova/all-MiniLM-L6-v2"
});

// Store for vector embeddings
let vectorStore: MemoryVectorStore | null = null;

/**
 * Handle errors gracefully to make sure embeddings initialization doesn't crash the app
 */
async function safelyInitializeEmbeddings(): Promise<boolean> {
  try {
    // Attempt to embed a simple text to verify embedding model works
    await embeddings.embedQuery("test");
    console.log("Local embeddings initialized successfully");
    return true;
  } catch (error) {
    console.error("Failed to initialize local embeddings:", error);
    console.warn("Falling back to direct text matching for HR policies");
    return false;
  }
}

// Initialize embeddings in the background
safelyInitializeEmbeddings().catch(err => {
  console.error("Error during embeddings initialization:", err);
});

/**
 * Initialize vector store with policy documents
 * @param policies HR policies to embed
 */
async function initializeVectorStore(policies: HRPolicy[]): Promise<MemoryVectorStore> {
  // Convert policies to documents for the vector store
  const documents = policies.map(policy => {
    return new Document({
      pageContent: policy.text,
      metadata: { topic: policy.topic }
    });
  });
  
  console.log(`Creating vector store with ${documents.length} documents`);
  
  // Create vector store
  return await MemoryVectorStore.fromDocuments(documents, embeddings);
}

/**
 * Find relevant HR policies based on a query using similarity search
 * @param policies Array of HR policies
 * @param query The user's query
 * @returns Matching policy texts
 */
async function findRelevantPoliciesBySimilarity(policies: HRPolicy[], query: string): Promise<string> {
  if (policies.length === 0) {
    return "Sorry, HR policy data is currently unavailable.";
  }
  
  try {
    // Skip similarity search if embedding initialization failed
    const embeddingsReady = await safelyInitializeEmbeddings();
    if (!embeddingsReady) {
      console.log("Using direct matching fallback due to embedding initialization failure");
      return DEFAULT_HR_POLICY;
    }
    
    // Initialize vector store if not already initialized
    if (!vectorStore) {
      try {
        console.log("Initializing vector store with policy documents");
        vectorStore = await initializeVectorStore(policies);
      } catch (error) {
        console.error("Error initializing vector store:", error);
        return DEFAULT_HR_POLICY;
      }
    }
    
    // Perform similarity search
    console.log(`Performing similarity search for query: ${query}`);
    const results = await vectorStore.similaritySearch(query, 3);
    
    if (results.length === 0) {
      return DEFAULT_HR_POLICY;
    }
    
    // Format results
    return results.map(doc => {
      const topic = doc.metadata.topic;
      return `${topic.toUpperCase()}: ${doc.pageContent}`;
    }).join('\n\n');
    
  } catch (error) {
    console.error('Error in similarity search:', error);
    return DEFAULT_HR_POLICY;
  }
}

/**
 * Creates a tool for querying HR policies
 * @returns The HR policy query tool
 */
export function createHRPolicyTool() {
  // Load HR policy data
  const hrPolicies = loadHRPolicyData();
  
  return new DynamicStructuredTool({
    name: "hr_policy_query",
    description: "Use this tool to answer questions about company HR policies, including attendance, leave, benefits, and workplace rules.",
    schema: z.object({
      query: z.string().describe("The HR policy topic or question to answer")
    }),
    func: async ({ query }) => {
      console.log(`HR Policy Tool Query: ${query}`);
      
      // Search through HR policies using similarity search
      const result = await findRelevantPoliciesBySimilarity(hrPolicies, query);
      console.log(`HR Policy Result: ${result.substring(0, 100)}...`);
      
      return result;
    }
  });
} 