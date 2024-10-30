import fs from 'fs';
import path from 'path';
import yaml from 'js-yaml';
import dotenv from 'dotenv';
import OpenAI from 'openai';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import { generateAndSaveIconWithRetry } from '../src/utils/perkIconGenerator';
import { Perk } from '../src/types/tech';

// Initialize paths
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const techTreePath = path.resolve(__dirname, '..', 'content', 'tech', 'tech-tree.yml');

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
    console.log(`Processing: ${perk.name}`);
    await generateAndSaveIconWithRetry(perk, openai);
    console.log(`Success: ${perk.name}`);
    return true;
  } catch (error) {
    console.error(`Failed to process ${perk.name}:`, error);
    return false;
  }
}

// Main function
async function main() {
  try {
    // Initialize OpenAI
    const openai = initializeOpenAI();
    
    // Load perks
    const perks = loadTechTree();
    console.log(`Found ${perks.length} perks to process`);

    // Process perks sequentially
    let successful = 0;
    let failed = 0;

    for (const perk of perks) {
      const success = await processPerk(perk, openai);
      if (success) {
        successful++;
      } else {
        failed++;
      }
      // Add a small delay between requests
      await new Promise(resolve => setTimeout(resolve, 1000));
    }

    // Print summary
    console.log('\nGeneration Summary:');
    console.log(`Successfully generated: ${successful}`);
    console.log(`Failed to generate: ${failed}`);

    // Exit with appropriate code
    process.exit(failed > 0 ? 1 : 0);
  } catch (error) {
    console.error('Fatal error:', error);
    process.exit(1);
  }
}

// Run the script
main().catch(error => {
  console.error('Unhandled error:', error);
  process.exit(1);
});

// Global error handlers
process.on('unhandledRejection', (error) => {
  console.error('Unhandled promise rejection:', error);
  process.exit(1);
});

process.on('uncaughtException', (error) => {
  console.error('Uncaught exception:', error);
  process.exit(1);
});
