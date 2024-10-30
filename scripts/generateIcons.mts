import fs from 'fs';
import path from 'path';
import yaml from 'js-yaml';
import * as dotenv from 'dotenv';
import OpenAI from 'openai';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import { generateAndSaveIconWithRetry } from '../src/utils/perkIconGenerator.js';
import { Perk } from '../src/types/tech.js';

// Initialize paths
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const techTreePath = path.resolve(__dirname, '..', 'content', 'tech', 'tech-tree.yml');

if (!fs.existsSync(techTreePath)) {
  throw new Error(`Tech tree file not found at: ${techTreePath}`);
}

// Load environment variables
dotenv.config();

// Helper function to validate OpenAI client
function initializeOpenAI(): OpenAI {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) {
    throw new Error('OPENAI_API_KEY not found in environment variables');
  }
  return new OpenAI({ apiKey });
}

// Helper function to load and parse tech tree
function loadTechTree(): Perk[] {
  try {
    const content = fs.readFileSync(techTreePath, 'utf8');
    const techTree = yaml.load(content) as Record<string, any>;

    if (!techTree || typeof techTree !== 'object') {
      throw new Error('Invalid tech tree data structure');
    }

    const perks: Perk[] = [];
    
    // Extract perks from each phase
    Object.entries(techTree).forEach(([phase, phaseData]: [string, any]) => {
      if (phaseData && typeof phaseData === 'object') {
        Object.entries(phaseData).forEach(([key, items]) => {
          if (!['name', 'period', 'description'].includes(key) && Array.isArray(items)) {
            items.forEach((item: any) => {
              if (item.name && item.tag) {
                perks.push(item as Perk);
              }
            });
          }
        });
      }
    });

    return perks;
  } catch (error) {
    console.error('Error loading tech tree:', error);
    throw error;
  }
}

// Helper function to process a single perk
async function processPerk(perk: Perk, openai: OpenAI): Promise<boolean> {
  try {
    console.log(`\nProcessing: ${perk.name}`);
    await generateAndSaveIconWithRetry(perk, openai);
    console.log(`Success: ${perk.name}`);
    return true;
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    console.error(`Failed to process ${perk.name}:`, errorMessage);
    return false;
  }
}

// Main function
async function main() {
  try {
    console.log('Initializing...');
    const openai = initializeOpenAI();
    
    console.log('Loading tech tree...');
    const perks = loadTechTree();
    console.log(`Found ${perks.length} perks to process`);

    let successful = 0;
    let failed = 0;

    for (const perk of perks) {
      const success = await processPerk(perk, openai);
      if (success) {
        successful++;
      } else {
        failed++;
      }
      // Add a small delay between perks
      await new Promise(resolve => setTimeout(resolve, 1000));
    }

    console.log('\nGeneration Summary:');
    console.log(`Successfully generated: ${successful}`);
    console.log(`Failed to generate: ${failed}`);

    if (failed > 0) {
      process.exit(1);
    }
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    console.error('Fatal error:', errorMessage);
    process.exit(1);
  }
}

// Run the script
main().catch(error => {
  const errorMessage = error instanceof Error ? error.message : String(error);
  console.error('Unhandled error:', errorMessage);
  process.exit(1);
});

// Global error handlers
process.on('unhandledRejection', (error: unknown) => {
  const errorMessage = error instanceof Error ? error.message : String(error);
  console.error('Unhandled promise rejection:', errorMessage);
  process.exit(1);
});

process.on('uncaughtException', (error: unknown) => {
  const errorMessage = error instanceof Error ? error.message : String(error);
  console.error('Uncaught exception:', errorMessage);
  process.exit(1);
});
