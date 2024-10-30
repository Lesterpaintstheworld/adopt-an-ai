import fs from 'fs';
import path from 'path';
import yaml from 'js-yaml';
import * as dotenv from 'dotenv';
import OpenAI from 'openai';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import { generateAndSaveIconWithRetry } from '../src/utils/perkIconGenerator.js';
import { Perk } from '../src/types/tech';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

async function generateIcons() {
  // Verify OpenAI API key exists
  if (!process.env.OPENAI_API_KEY) {
    throw new Error('OPENAI_API_KEY environment variable is not set');
  }

  try {
    // Initialize OpenAI client
    const openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
    });

    // Read and parse the tech tree YAML file
    const techTreePath = path.join(__dirname, '../content/tech/tech-tree.yml');
    
    // Verify file exists
    if (!fs.existsSync(techTreePath)) {
      throw new Error(`Tech tree file not found at: ${techTreePath}`);
    }

    console.log('Reading tech tree from:', techTreePath);
    const techTreeContent = fs.readFileSync(techTreePath, 'utf8');
    
    let techTree;
    try {
      techTree = yaml.load(techTreeContent) as any;
    } catch (error) {
      console.error('Error parsing YAML:', error);
      throw error;
    }

    // Process each phase
    for (const [phaseName, phaseData] of Object.entries(techTree)) {
      console.log(`Processing ${phaseName}...`);
      
      // Process each layer in the phase
      for (const [layerName, items] of Object.entries(phaseData as any)) {
        if (['name', 'period', 'description'].includes(layerName)) continue;
        
        console.log(`Processing ${layerName}...`);
        
        // Process each item in the layer
        for (const item of items as Perk[]) {
          try {
            console.log(`Generating icon for ${item.name}...`);
            await generateAndSaveIconWithRetry(item, openai);
          } catch (error) {
            console.error(`Failed to generate icon for ${item.name}:`, error);
            // Continue with next item instead of stopping completely
          }
        }
      }
    }
    
    console.log('Icon generation complete!');
  } catch (error) {
    console.error('Error during icon generation:', error);
    process.exit(1);
  }
}

// Use proper promise handling
generateIcons().catch(error => {
  console.error('Fatal error during icon generation:', error);
  process.exit(1);
});
