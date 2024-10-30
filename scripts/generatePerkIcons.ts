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

    // Extract all perks from the tech tree
    const perks = Object.values(techTree as any).flatMap((phase: any) =>
      Object.entries(phase)
        .filter(([key]) => !['name', 'period', 'description'].includes(key))
        .flatMap(([_, items]: [string, any]) => items)
    );

    console.log(`Found ${perks.length} perks to process`);

    // Generate icons for all perks
    for (const perk of perks) {
      try {
        console.log(`Generating icon for ${perk.name}...`);
        const openai = new OpenAI({ apiKey: openaiApiKey });
        await generateAndSaveIconWithRetry(perk, openai);
        console.log(`Successfully generated icon for ${perk.name}`);
        // Add a delay to avoid rate limits
        await new Promise(resolve => setTimeout(resolve, 1000));
      } catch (error) {
        console.error(`Failed to generate icon for ${perk.name}:`, error);
        // Continue with next perk even if one fails
      }
    }
  } catch (error) {
    console.error('Fatal error in generateAllIcons:', error);
    process.exit(1);
  }
};

// Run the script with proper error handling
generateAllIcons().catch(error => {
  console.error('Script failed:', error);
  process.exit(1);
});
