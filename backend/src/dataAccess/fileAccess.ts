import fs from 'fs';
import path from 'path';
import yaml from 'js-yaml';
import { parse } from 'csv-parse/sync';

const DATA_DIR = path.join(__dirname, '../../data');

/**
 * Reads and parses a YAML file
 * @param filename The name of the YAML file to read
 * @returns The parsed YAML data
 */
export function readYamlFile<T>(filename: string): T {
  try {
    const filePath = path.join(DATA_DIR, filename);
    const fileContents = fs.readFileSync(filePath, 'utf8');
    return yaml.load(fileContents) as T;
  } catch (error) {
    console.error(`Error reading YAML file ${filename}:`, error);
    throw new Error(`Failed to read data from ${filename}`);
  }
}

/**
 * Writes data to a YAML file
 * @param filename The name of the YAML file to write
 * @param data The data to write to the file
 * @returns Success status
 */
export function writeYamlFile<T>(filename: string, data: T): boolean {
  try {
    const filePath = path.join(DATA_DIR, filename);
    const yamlStr = yaml.dump(data);
    fs.writeFileSync(filePath, yamlStr, 'utf8');
    console.log(`Successfully wrote data to ${filename}`);
    return true;
  } catch (error) {
    console.error(`Error writing YAML file ${filename}:`, error);
    return false;
  }
}

/**
 * Reads and parses a CSV file
 * @param filename The name of the CSV file to read
 * @returns The parsed CSV data
 */
export function readCsvFile<T>(filename: string): T[] {
  const filePath = path.join(DATA_DIR, filename);
  const fileContents = fs.readFileSync(filePath, 'utf8');
  return parse(fileContents, { columns: true, skip_empty_lines: true }) as unknown as T[];
}
