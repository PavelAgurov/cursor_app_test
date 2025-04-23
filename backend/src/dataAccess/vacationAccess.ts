import fs from 'fs';
import path from 'path';
import yaml from 'js-yaml';
import { readYamlFileFromPath, writeYamlFileToPath } from './fileAccess';

export interface VacationRequest {
  id: number;
  employeeName: string;
  startDate: string;
  endDate: string;
  status: 'pending' | 'approved' | 'rejected';
}

export interface VacationRequests {
  vacation_requests: VacationRequest[];
}

const vacation_requests_filePath = path.join(__dirname, '../../../data/vacation-requests.yaml');

/**
 * Load vacation requests from YAML file
 * @returns Vacation requests object
 */
function loadVacationRequests(): VacationRequests {
  try {
    if (!fs.existsSync(vacation_requests_filePath)) {
      console.error('Vacation requests file not found');
      return { vacation_requests: [] };
    }
    
    // Read the file content directly each time
    const fileContent = fs.readFileSync(vacation_requests_filePath, 'utf8');
    console.log('Reading vacation requests directly from file');
    
    // Parse YAML content
    const data = yaml.load(fileContent) as VacationRequests;
    
    // Ensure the data structure is valid
    if (!data || !data.vacation_requests || !Array.isArray(data.vacation_requests)) {
      console.error('Invalid vacation requests data structure');
      return { vacation_requests: [] };
    }
    
    console.log(`Loaded ${data.vacation_requests.length} vacation requests from file`);
    return data;
  } catch (error) {
    console.error('Error loading vacation requests:', error);
    return { vacation_requests: [] };
  }
}

/**
 * Save vacation requests to YAML file
 * @param requests Vacation requests object
 * @returns Success status
 */
function saveVacationRequests(requests: VacationRequests): boolean {
  return writeYamlFileToPath(vacation_requests_filePath, requests);
}

/**
 * Get the next available ID for a new vacation request
 * @param requests Existing vacation requests
 * @returns The next available ID
 */
function getNextId(requests: VacationRequest[]): number {
  if (requests.length === 0) {
    return 1;
  }
  
  const maxId = Math.max(...requests.map(req => req.id));
  return maxId + 1;
}

/**
 * Get all vacation requests
 * @returns Array of vacation requests
 */
export function getAllVacationRequests(): VacationRequest[] {
  const data = loadVacationRequests();
  return data.vacation_requests;
}

/**
 * Create a new vacation request
 * @param employeeName The name of the employee
 * @param startDate The start date of the vacation
 * @param endDate The end date of the vacation
 * @returns true if successful, false otherwise
 */
export function createNewVacationRequest(employeeName: string, startDate: string, endDate: string): boolean {
  const data = loadVacationRequests();
  const newId = getNextId(data.vacation_requests);
  const newRequest: VacationRequest = {
    id: newId,
    employeeName,
    startDate,
    endDate,
    status: 'pending'
  };

  data.vacation_requests.push(newRequest);
  return saveVacationRequests(data);
} 