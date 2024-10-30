import fs from 'fs/promises';
import path from 'path';
import yaml from 'js-yaml';
import dotenv from 'dotenv';
import OpenAI from 'openai';
import { fileURLToPath } from 'url';
import { TAG_STYLES } from '../src/utils/tagStyles';

// Configuration
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ICONS_DIR = path.join(process.cwd(), 'public', 'perk-icons');
const TECH_TREE_PATH = path.join(process.cwd(), 'content', 'tech', 'tech-tree.yml');

// Initialize environment variables
dotenv.config();

// Basic type definitions
type Perk = {
  name: string;
  tag: string;
  description: string;
  shortDescription?: string;
  longDescription?: string;
  prerequisites?: string[];
};

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

async function generateIconPrompt(perk: Perk): string {
  const tagType = perk.tag.split(' ')[1];
  const style = TAG_STYLES[tagType];
  
  if (!style) {
    throw new Error(`Unknown tag type: ${tagType}`);
  }

  const basePrompt = `Create a World of Warcraft style ability icon with a futuristic twist. The icon should feature ${style.palette}. The icon represents "${perk.shortDescription || perk.description}". Style: ${style.theme}.`;
  const technicalSpecs = `The image should be a square icon with a dark border and inner glow, highly detailed in a semi-realistic style. The composition should be centered and instantly recognizable as a game ability icon while maintaining a sci-fi aesthetic.`;
  
  return `${basePrompt} ${technicalSpecs}`;
}

async function generateIcon(perk: Perk, openai: OpenAI): Promise<Buffer> {
  try {
    const prompt = await generateIconPrompt(perk);
    console.log(`Generating icon for ${perk.name} with prompt: ${prompt}`);
    
    const response = await openai.images.generate({
      model: "dall-e-3",
      prompt: prompt,
      n: 1,
      size: "1024x1024",
      response_format: "b64_json"
    });

    const imageData = response.data[0].b64_json;
    if (!imageData) {
      throw new Error('No image data received from OpenAI');
    }

    return Buffer.from(imageData, 'base64');
  } catch (error) {
    console.error(`Error generating icon for ${perk.name}:`, error);
    throw error;
  }
}

async function main() {
  try {
    console.log('Starting icon generation process...');
    
    // Validate OpenAI API key
    if (!process.env.OPENAI_API_KEY) {
      throw new Error('OPENAI_API_KEY environment variable is not set');
    }

    // Initialize OpenAI client
    const openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY
    });

    // Ensure icons directory exists
    await ensureDirectory(ICONS_DIR);

    // Read and parse tech tree
    const techTreeContent = await fs.readFile(TECH_TREE_PATH, 'utf8');
    const techTree = yaml.load(techTreeContent) as Record<string, any>;

    // Extract perks
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

    // Process each perk
    for (const perk of perks) {
      const iconPath = path.join(ICONS_DIR, sanitizeFilename(perk.name));
      
      if (await fileExists(iconPath)) {
        console.log(`Icon already exists for ${perk.name}, skipping...`);
        continue;
      }

      try {
        const imageBuffer = await generateIcon(perk, openai);
        await fs.writeFile(iconPath, imageBuffer);
        console.log(`Successfully generated icon for ${perk.name}`);
      } catch (error) {
        console.error(`Failed to generate icon for ${perk.name}:`, error);
        throw error; // Re-throw to be caught by outer catch
      }

      // Add a small delay between requests
      await new Promise(resolve => setTimeout(resolve, 1000));
    }

    console.log('Icon generation process completed successfully');
  } catch (error) {
    console.error('Error during icon generation:', error);
    throw error; // Re-throw to be caught by the top-level catch
  }
}

// Execute with proper error handling
main().catch(error => {
  console.error('Unhandled error in main process:', error);
  process.exit(1);
});
