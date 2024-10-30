import fs from 'fs/promises';
import path from 'path';
import yaml from 'js-yaml';
import * as dotenv from 'dotenv';
import OpenAI from 'openai';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import { generateAndSaveIconWithRetry } from '../src/utils/perkIconGenerator.js';
import { Perk } from '../src/types/tech.js';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Add detailed promise rejection handler
process.on('unhandledRejection', (reason, promise) => {
  console.error('=== Unhandled Promise Rejection ===');
  console.error('Promise:', promise);
  console.error('Reason:', reason);
  if (reason instanceof Error) {
    console.error('Stack:', reason.stack);
  }
  console.error('Full reason object:', JSON.stringify(reason, null, 2));
  process.exit(1);
});

// Add uncaught exception handler
process.on('uncaughtException', (error) => {
  console.error('=== Uncaught Exception ===');
  console.error('Error:', error);
  console.error('Stack:', error.stack);
  process.exit(1);
});

async function generateIcons() {
  try {
    console.log('=== Starting Icon Generation Process ===');
    
    // Add version logging
    console.log('Node version:', process.version);
    console.log('TypeScript version:', require('typescript').version);
    
    if (!process.env.OPENAI_API_KEY) {
      throw new Error('OPENAI_API_KEY environment variable is not set');
    }
    console.log('OpenAI API key verified');

    const openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
    });

    // Test OpenAI connection
    try {
      await openai.models.list();
      console.log('OpenAI connection verified');
    } catch (error) {
      console.error('OpenAI connection test failed:', error);
      throw error;
    }

    const techTreePath = path.resolve(__dirname, '../content/tech/tech-tree.yml');
    console.log('Tech tree path:', techTreePath);
    
    if (!fs.existsSync(techTreePath)) {
      throw new Error(`Tech tree file not found at: ${techTreePath}`);
    }

    const techTreeContent = fs.readFileSync(techTreePath, 'utf8');
    let techTree;
    
    try {
      techTree = yaml.load(techTreeContent) as any;
    } catch (error) {
      console.error('YAML parsing error:', error);
      throw error;
    }

    // Process phases sequentially using for...of
    for (const [phaseName, phaseData] of Object.entries(techTree)) {
      console.log(`\nProcessing phase: ${phaseName}`);
      
      for (const [layerName, items] of Object.entries(phaseData as any)) {
        if (['name', 'period', 'description'].includes(layerName)) {
          continue;
        }
        
        console.log(`Processing layer: ${layerName}`);
        
        // Process items sequentially using for...of
        for (const item of items as Perk[]) {
          try {
            console.log(`\nStarting icon generation for: ${item.name}`);
            console.log('Item details:', JSON.stringify(item, null, 2));
            
            const result = await generateAndSaveIconWithRetry(item, openai)
              .catch(error => {
                console.error(`Caught error in generateAndSaveIconWithRetry:`, error);
                throw error;
              });
              
            console.log(`Icon generated successfully: ${result}`);
          } catch (error) {
            console.error(`Error processing item ${item.name}:`, error);
            console.error('Full error details:', JSON.stringify(error, null, 2));
            // Continue with next item
          }
        }
      }
    }
    
    console.log('\n=== Icon Generation Complete ===');
  } catch (error) {
    console.error('=== Fatal Error in Generation Process ===');
    console.error('Error:', error);
    if (error instanceof Error) {
      console.error('Stack:', error.stack);
    }
    console.error('Full error details:', JSON.stringify(error, null, 2));
    throw error; // Re-throw to be caught by the main wrapper
  }
}

// Main execution wrapper
(async () => {
  try {
    await generateIcons();
  } catch (error) {
    console.error('=== Fatal Error in Main Execution ===');
    console.error('Error:', error);
    if (error instanceof Error) {
      console.error('Stack:', error.stack);
    }
    process.exit(1);
  }
})();
