import fs from 'fs/promises';
import path from 'path';
import yaml from 'js-yaml';
import dotenv from 'dotenv';
import OpenAI from 'openai';
import { fileURLToPath } from 'url';

import { TAG_STYLES } from '../src/utils/tagStyles';

// Basic type definitions
type Perk = {
  name: string;
  tag: string;
  description: string;
  shortDescription?: string;
  longDescription?: string;
};

// Configuration
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ICONS_DIR = path.join(process.cwd(), 'public', 'perk-icons');
const TECH_TREE_PATH = path.join(process.cwd(), 'content', 'tech', 'tech-tree.yml');

// Initialize environment variables
dotenv.config();

// Utility functions
async function ensureDirectory(dir: string) {
  try {
    await fs.access(dir);
  } catch {
    await fs.mkdir(dir, { recursive: true });
  }
}

function sanitizeFilename(name: string): string {
  return name.toLowerCase().replace(/[^a-z0-9]/g, '-') + '.png';
}

async function fileExists(path: string): Promise<boolean> {
  try {
    await fs.access(path);
    return true;
  } catch {
    return false;
  }
}

// Core functionality
async function generateIconPrompt(perk: Perk): string {
  try {
    console.log(`Generating prompt for perk: ${perk.name}`);
    console.log(`Perk tag: ${perk.tag}`);
    
    const specificElements = await generateSpecificIconElements(perk, openai);
    console.log(`Generated specific elements: ${specificElements}`);
    return specificElements;
  } catch (error) {
    console.warn('Failed to generate specific prompt, falling back to default:', error);
    const tagType = perk.tag.split(' ')[1];
    console.log(`Using tag type: ${tagType} for default prompt`);
    
    const style = TAG_STYLES[tagType];
    if (!style) {
      console.error(`No style found for tag type: ${tagType}`);
      throw new Error(`Unknown tag type: ${tagType}`);
    }

    const basePrompt = `Create a World of Warcraft style ability icon with a futuristic twist. The icon should feature ${style.palette}. The icon represents "${perk.shortDescription || perk.description}". Style: ${style.theme}.`;
    const technicalSpecs = `The image should be a square icon with a dark border and inner glow, highly detailed in a semi-realistic style. The composition should be centered and instantly recognizable as a game ability icon while maintaining a sci-fi aesthetic.`;
    const finalPrompt = `${basePrompt} ${technicalSpecs}`;
    
    console.log(`Generated fallback prompt: ${finalPrompt}`);
    return finalPrompt;
  }
}

async function generateSpecificIconElements(perk: Perk, openai: OpenAI): Promise<string> {
  const prompt = `You are an expert at creating DALL-E image generation prompts.
Generate a detailed prompt for a World of Warcraft style ability icon with a futuristic twist.
The icon should maintain consistency with other ability icons while being unique and recognizable.

The icon represents this perk:
Name: ${perk.name}
Short description: ${perk.shortDescription || ''}
Long description: ${perk.longDescription || perk.description || ''}
Tag type: ${perk.tag}
Phase: ${getPhaseFromPrerequisites(perk)}

Requirements:
- Must be in World of Warcraft ability icon style
- Should have a futuristic sci-fi aesthetic
- Include specific visual elements that represent the perk's function
- Use appropriate colors and symbols
- Must be instantly recognizable at small sizes
- Should include lighting effects and depth
- Must maintain professional game-like quality

Focus on the visual elements only. Be specific but concise.
Do not include technical specifications or image size requirements.`;

  try {
    const completion = await openai.chat.completions.create({
      model: "gpt-4",
      messages: [{ role: "user", content: prompt }],
      temperature: 0.7,
      max_tokens: 150
    });

    return completion.choices[0].message.content || getDefaultVisualElements(perk);
  } catch (error) {
    console.error('Failed to generate prompt with GPT-4:', error);
    return getDefaultVisualElements(perk);
  }
}

const getPhaseFromPrerequisites = (perk: Perk): string => {
  const phases = ['phase_1', 'phase_2', 'phase_3', 'phase_4'];
  return phases.find(phase => 
    perk.prerequisites?.some(prereq => prereq.includes(phase))
  ) || 'phase_1';
};

const getDefaultVisualElements = (perk: Perk): string => {
  const phaseElements = {
    phase_1: 'with foundational, crystalline structures',
    phase_2: 'with evolving, dynamic patterns',
    phase_3: 'with transcendent, ethereal effects',
    phase_4: 'with perfect, harmonious symmetry'
  };

  const phase = getPhaseFromPrerequisites(perk);
  return phaseElements[phase as keyof typeof phaseElements];
};

async function generateIcon(perk: Perk, openai: OpenAI): Promise<Buffer> {
  try {
    const prompt = await generateIconPrompt(perk);
    console.log(`Generating icon for ${perk.name} with prompt: ${prompt}`);
    console.log('Sending request to DALL-E...');
    
    const response = await openai.images.generate({
      model: "dall-e-3",
      prompt: prompt,
      n: 1,
      size: "1024x1024", // Square format is fastest
      quality: "standard", // Standard quality for faster generation
      response_format: "b64_json"
    });
    console.log('Received response from DALL-E');

    const imageData = response.data[0].b64_json;
    if (!imageData) {
      throw new Error('No image data received from OpenAI');
    }
    console.log('Successfully extracted image data');

    return Buffer.from(imageData, 'base64');
  } catch (error) {
    console.error(`Error generating icon for ${perk.name}:`, error);
    if (error instanceof Error) {
      console.error('Error stack:', error.stack);
    }
    throw error;
  }
}

async function generateIconWithRetry(perk: Perk, openai: OpenAI, maxRetries = 3): Promise<Buffer> {
  let lastError: Error | null = null;
  
  for (let i = 0; i < maxRetries; i++) {
    try {
      console.log(`Attempt ${i + 1}/${maxRetries} for ${perk.name}`);
      return await generateIcon(perk, openai);
    } catch (error) {
      lastError = error instanceof Error ? error : new Error(String(error));
      console.error(`Attempt ${i + 1} failed for ${perk.name}:`, lastError.message);
      if (i < maxRetries - 1) {
        const delay = 2000 * (i + 1);
        console.log(`Waiting ${delay}ms before retry...`);
        await new Promise(resolve => setTimeout(resolve, delay));
      }
    }
  }
  
  throw new Error(`Failed to generate icon for ${perk.name} after ${maxRetries} retries. Last error: ${lastError?.message}`);
}

// Add global unhandled rejection handler
process.on('unhandledRejection', (reason, promise) => {
  console.error('Unhandled Rejection at:', promise, 'reason:', reason);
  process.exit(1);
});

// Main execution
async function main() {
  console.log('=== Starting Icon Generation Process ===');
  console.log('Current working directory:', process.cwd());
  console.log('Node version:', process.version);
  
  try {
    // Validate OpenAI API key
    console.log('Checking OpenAI API key...');
    if (!process.env.OPENAI_API_KEY) {
      throw new Error('OPENAI_API_KEY environment variable is not set');
    }
    console.log('OpenAI API key found');

    // Initialize OpenAI client
    console.log('Initializing OpenAI client...');
    const openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY
    });

    // Test OpenAI connection
    console.log('Testing OpenAI connection...');
    try {
      const models = await openai.models.list();
      console.log('Successfully connected to OpenAI. Available models:', models.data.length);
    } catch (apiError) {
      console.error('OpenAI connection test failed:', apiError);
      throw new Error(`Failed to connect to OpenAI API: ${apiError instanceof Error ? apiError.message : String(apiError)}`);
    }

    // Ensure icons directory exists
    console.log(`Ensuring icons directory exists at: ${ICONS_DIR}`);
    await ensureDirectory(ICONS_DIR);
    console.log('Icons directory ready');

    // Read and parse tech tree
    console.log(`Reading tech tree from: ${TECH_TREE_PATH}`);
    let techTree;
    try {
      const techTreeContent = await fs.readFile(TECH_TREE_PATH, 'utf8');
      console.log('Tech tree file read successfully');
      techTree = yaml.load(techTreeContent) as Record<string, any>;
      if (!techTree) {
        throw new Error('Tech tree file is empty or invalid');
      }
      console.log('Tech tree parsed successfully');
    } catch (error) {
      console.error('Failed to read or parse tech tree:', error);
      throw new Error(`Failed to read or parse tech tree: ${error instanceof Error ? error.message : String(error)}`);
    }

    // Extract and process perks
    console.log('Extracting perks from tech tree...');
    const perks: Perk[] = [];
    for (const phase of Object.values(techTree)) {
      if (typeof phase === 'object') {
        for (const [key, value] of Object.entries(phase)) {
          if (Array.isArray(value) && !['name', 'period', 'description'].includes(key)) {
            perks.push(...value as Perk[]);
          }
        }
      }
    }
    console.log(`Found ${perks.length} total perks to process`);

    let totalPerks = 0;
    let completedPerks = 0;
    let skippedPerks = 0;
    let failedPerks = 0;

    // Process each perk
    for (const perk of perks) {
      totalPerks++;
      const iconPath = path.join(ICONS_DIR, sanitizeFilename(perk.name));
      
      console.log(`\n=== Processing perk ${totalPerks}/${perks.length}: ${perk.name} ===`);
      console.log(`Icon path: ${iconPath}`);
      
      try {
        if (await fileExists(iconPath)) {
          skippedPerks++;
          console.log(`Icon already exists for ${perk.name}, skipping... (${completedPerks}/${totalPerks} completed, ${skippedPerks} skipped)`);
          continue;
        }

        console.log(`Generating icon for ${perk.name}...`);
        const imageBuffer = await generateIconWithRetry(perk, openai);
        console.log(`Writing icon to ${iconPath}...`);
        await fs.writeFile(iconPath, imageBuffer);
        completedPerks++;
        console.log(`Successfully generated icon for ${perk.name} (${completedPerks}/${totalPerks} completed, ${skippedPerks} skipped)`);
        
        // Add a small delay between requests
        const delay = 1000;
        console.log(`Waiting ${delay}ms before next request...`);
        await new Promise(resolve => setTimeout(resolve, delay));
      } catch (error) {
        failedPerks++;
        console.error(`Failed to generate icon for ${perk.name} (${failedPerks} failed):`, error);
      }
    }

    console.log(`\n=== Icon Generation Summary ===`);
    console.log(`Total perks: ${totalPerks}`);
    console.log(`Successfully generated: ${completedPerks}`);
    console.log(`Skipped (already exist): ${skippedPerks}`);
    console.log(`Failed: ${failedPerks}`);
}

// Execute with proper error handling
main().catch(error => {
  // Properly format and display the error
  console.error('Fatal error occurred:');
  if (error instanceof Error) {
    console.error(`Name: ${error.name}`);
    console.error(`Message: ${error.message}`);
    console.error(`Stack: ${error.stack}`);
  } else {
    console.error('Unknown error type:', error);
  }
  process.exit(1);
});
