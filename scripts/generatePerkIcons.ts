import fs from 'fs/promises';
import path from 'path';
import yaml from 'js-yaml';
import dotenv from 'dotenv';
import OpenAI from 'openai';
import { fileURLToPath } from 'url';
import { generateAndSaveIconWithRetry } from '../src/utils/perkIconGenerator';

// Initialize environment variables
dotenv.config();

// Basic type definitions
type Perk = {
  name: string;
  tag: string;
  description: string;
  shortDescription?: string;
  longDescription?: string;
};

async function getAllPerks(): Promise<Perk[]> {
  const __filename = fileURLToPath(import.meta.url);
  const __dirname = path.dirname(__filename);
  const techTreePath = path.join(__dirname, '..', 'content', 'tech', 'tech-tree.yml');
  
  const content = await fs.readFile(techTreePath, 'utf8');
  const techTree = yaml.load(content) as any;
  
  const perks: Perk[] = [];
  
  // Extract perks from each phase
  Object.values(techTree).forEach((phase: any) => {
    Object.entries(phase).forEach(([key, value]: [string, any]) => {
      if (!['name', 'period', 'description'].includes(key)) {
        value.forEach((item: Perk) => {
          perks.push(item);
        });
      }
    });
  });
  
  return perks;
}

async function main() {
  try {
    if (!process.env.OPENAI_API_KEY) {
      throw new Error('OPENAI_API_KEY not found in environment');
    }

    const openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY
    });

    const perks = await getAllPerks();
    console.log(`Found ${perks.length} perks to process`);

    for (const perk of perks) {
      try {
        console.log(`\nProcessing: ${perk.name}`);
        await generateAndSaveIconWithRetry(perk, openai);
        console.log(`Successfully generated icon for ${perk.name}`);
      } catch (error) {
        console.error(`Failed to generate icon for ${perk.name}:`, error);
      }
    }

    console.log('\nIcon generation complete!');
  } catch (error) {
    console.error('Fatal error:', error);
    process.exit(1);
  }
}

main().catch(error => {
  console.error('Unhandled error:', error);
  process.exit(1);
});
