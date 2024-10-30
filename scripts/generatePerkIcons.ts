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

// Add global promise rejection handler
process.on('unhandledRejection', (reason, promise) => {
  console.error('Unhandled Rejection at:', promise);
  console.error('Reason:', reason);
  process.exit(1);
});

async function generateIcons() {
  console.log('Starting icon generation process...');
  
  try {
    // Verify OpenAI API key exists
    if (!process.env.OPENAI_API_KEY) {
      throw new Error('OPENAI_API_KEY environment variable is not set');
    }
    console.log('OpenAI API key found');

    // Initialize OpenAI client
    const openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
    });
    console.log('OpenAI client initialized');

    // Read and parse the tech tree YAML file
    const techTreePath = path.resolve(__dirname, '../content/tech/tech-tree.yml');
    console.log('Tech tree path:', techTreePath);
    
    // Verify file exists
    if (!fs.existsSync(techTreePath)) {
      throw new Error(`Tech tree file not found at: ${techTreePath}`);
    }
    console.log('Tech tree file found');

    const techTreeContent = fs.readFileSync(techTreePath, 'utf8');
    console.log('Tech tree file read successfully');
    
    let techTree;
    try {
      techTree = yaml.load(techTreeContent) as any;
      console.log('YAML parsed successfully');
    } catch (error) {
      console.error('Error parsing YAML:', error);
      throw error;
    }

    // Process each phase
    for (const [phaseName, phaseData] of Object.entries(techTree)) {
      console.log(`\nProcessing phase: ${phaseName}`);
      
      // Process each layer in the phase
      for (const [layerName, items] of Object.entries(phaseData as any)) {
        if (['name', 'period', 'description'].includes(layerName)) {
          console.log(`Skipping metadata field: ${layerName}`);
          continue;
        }
        
        console.log(`Processing layer: ${layerName}`);
        
        // Process each item in the layer
        for (const item of items as Perk[]) {
          try {
            console.log(`\nGenerating icon for: ${item.name}`);
            const result = await generateAndSaveIconWithRetry(item, openai)
              .catch(error => {
                console.error(`Error in generateAndSaveIconWithRetry for ${item.name}:`, error);
                throw error;
              });
            console.log(`Icon generated successfully for ${item.name}: ${result}`);
          } catch (error) {
            console.error(`Failed to generate icon for ${item.name}:`, error);
            // Log the full error object for debugging
            console.error('Full error object:', JSON.stringify(error, null, 2));
            // Continue with next item instead of stopping completely
          }
        }
      }
    }
    
    console.log('\nIcon generation complete!');
  } catch (error) {
    console.error('Fatal error during icon generation:', error);
    // Log the full error object for debugging
    console.error('Full error object:', JSON.stringify(error, null, 2));
    process.exit(1);
  }
}

// Use proper promise handling with async main function
(async () => {
  try {
    await generateIcons();
  } catch (error) {
    console.error('Fatal error in main execution:', error);
    console.error('Full error object:', JSON.stringify(error, null, 2));
    process.exit(1);
  }
})();
