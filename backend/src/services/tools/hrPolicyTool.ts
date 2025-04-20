import { z } from "zod";
import { DynamicStructuredTool } from "@langchain/core/tools";
import fs from 'fs';
import path from 'path';
import { parse } from 'csv-parse/sync';

interface HRPolicy {
  topic: string;
  text: string;
}

/**
 * Load HR policy data from CSV file
 * @returns Array of HR policies
 */
function loadHRPolicyData(): HRPolicy[] {
  try {
    // Try multiple possible locations for the data file
    let filePath = path.join(__dirname, '../../../../data/hr_general_data.csv');
    
    if (!fs.existsSync(filePath)) {
      filePath = path.join(__dirname, '../../../data/hr_general_data.csv');
    }
    
    if (!fs.existsSync(filePath)) {
      filePath = path.join(process.cwd(), 'data/hr_general_data.csv');
    }
    
    console.log('HR policy data file path:', filePath);
    
    if (!fs.existsSync(filePath)) {
      console.error('HR policy data file not found');
      return [];
    }
    
    const fileContent = fs.readFileSync(filePath, 'utf8');
    
    // Parse CSV data
    const records = parse(fileContent, {
      columns: true,
      skip_empty_lines: true
    });
    
    console.log(`Loaded ${records.length} HR policies`);
    return records as HRPolicy[];
  } catch (error) {
    console.error('Error loading HR policy data:', error);
    return [];
  }
}

/**
 * Find relevant HR policies based on a query
 * @param policies Array of HR policies
 * @param query The user's query
 * @returns Matching policy texts
 */
function findRelevantPolicies(policies: HRPolicy[], query: string): string {
  if (policies.length === 0) {
    return "Sorry, HR policy data is currently unavailable.";
  }
  
  // Convert query to lowercase for case-insensitive matching
  const lowerQuery = query.toLowerCase();
  
  // Look for exact topic matches first
  const exactMatch = policies.find(
    policy => policy.topic.toLowerCase() === lowerQuery
  );
  
  if (exactMatch) {
    return `${exactMatch.topic.toUpperCase()}: ${exactMatch.text}`;
  }
  
  // Look for partial matches in topics
  const topicMatches = policies.filter(
    policy => policy.topic.toLowerCase().includes(lowerQuery)
  );
  
  if (topicMatches.length > 0) {
    return topicMatches
      .map(policy => `${policy.topic.toUpperCase()}: ${policy.text}`)
      .join('\n\n');
  }
  
  // Look for keyword matches in policy text
  const keywordMatches = policies.filter(
    policy => policy.text.toLowerCase().includes(lowerQuery)
  );
  
  if (keywordMatches.length > 0) {
    return keywordMatches
      .map(policy => `${policy.topic.toUpperCase()}: ${policy.text}`)
      .join('\n\n');
  }
  
  // No matches found
  return "I couldn't find specific information about that in our HR policies. Please try asking in a different way or contact HR for more information.";
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
      query: z.string().describe("The HR policy question to answer")
    }),
    func: async ({ query }) => {
      console.log(`HR Policy Tool Query: ${query}`);
      
      // Search through HR policies and return relevant information
      const result = findRelevantPolicies(hrPolicies, query);
      console.log(`HR Policy Result: ${result.substring(0, 100)}...`);
      
      return result;
    }
  });
} 