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
  try {
    // Initialize OpenAI client
    const openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
    });

    // Read and parse the tech tree YAML file
    const techTreePath = path.join(__dirname, '../content/tech/tech-tree.yml');
    const techTreeContent = fs.readFileSync(techTreePath, 'utf8');
    const techTree = yaml.load(techTreeContent) as any;

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

generateIcons().catch(console.error);
