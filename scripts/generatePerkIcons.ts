import fs from 'fs';
import path from 'path';
import yaml from 'js-yaml';
import dotenv from 'dotenv';
import OpenAI from 'openai';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import { generateAndSaveIcon, generateAndSaveIconWithRetry } from '../src/utils/perkIconGenerator';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

dotenv.config();

const generateAllIcons = async () => {
  try {
    // Check for OpenAI API key
    const openaiApiKey = process.env.OPENAI_API_KEY;
    if (!openaiApiKey) {
      throw new Error('OPENAI_API_KEY not found in environment variables');
    }

    // Initialize OpenAI client
    const openai = new OpenAI({ apiKey: openaiApiKey });

    // Load and parse the YAML file
    const techTreePath = path.resolve(__dirname, '..', 'content', 'tech', 'tech-tree.yml');
    let techTree;
    try {
      const techTreeContent = fs.readFileSync(techTreePath, 'utf8');
      techTree = yaml.load(techTreeContent);
    } catch (error) {
      console.error('Error loading tech-tree.yml:', error);
      throw error;
    }

    if (!techTree || typeof techTree !== 'object') {
      throw new Error('Invalid tech tree data structure');
    }

    // Extract all perks from the tech tree
    const perks = Object.values(techTree).flatMap((phase: any) =>
      Object.entries(phase)
        .filter(([key]) => !['name', 'period', 'description'].includes(key))
        .flatMap(([_, items]: [string, any]) => items)
    );

    console.log(`Found ${perks.length} perks to process`);

    // Generate icons for all perks
    const results = await Promise.allSettled(
      perks.map(async (perk) => {
        try {
          console.log(`Generating icon for ${perk.name}...`);
          await generateAndSaveIconWithRetry(perk, openai);
          console.log(`Successfully generated icon for ${perk.name}`);
          return { perk: perk.name, success: true };
        } catch (error) {
          console.error(`Failed to generate icon for ${perk.name}:`, error);
          return { perk: perk.name, success: false, error };
        }
      })
    );

    // Log summary
    const successful = results.filter(r => r.status === 'fulfilled' && r.value.success).length;
    const failed = results.filter(r => r.status === 'rejected' || (r.status === 'fulfilled' && !r.value.success)).length;
    
    console.log('\nGeneration Summary:');
    console.log(`Successfully generated: ${successful}`);
    console.log(`Failed to generate: ${failed}`);

    if (failed > 0) {
      throw new Error(`Failed to generate ${failed} icons`);
    }

  } catch (error) {
    console.error('Fatal error in generateAllIcons:', error);
    process.exit(1);
  }
};

// Run the script
generateAllIcons().catch(error => {
  console.error('Script failed:', error);
  process.exit(1);
});

process.on('unhandledRejection', (error) => {
  console.error('Unhandled promise rejection:', error);
  process.exit(1);
});
