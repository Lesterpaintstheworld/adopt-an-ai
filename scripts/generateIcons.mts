import fs from 'fs/promises';
import path from 'path';
import yaml from 'js-yaml';
import dotenv from 'dotenv';
import OpenAI from 'openai';
import { fileURLToPath } from 'url';

// Basic type definitions
type Perk = {
  name: string;
  tag: string;
  description: string;
  shortDescription?: string;
  longDescription?: string;
};

interface TagStyle {
  palette: string;
  theme: string;
}

const TAG_STYLES: { [key: string]: TagStyle } = {
  'CREATIVE': {
    palette: 'vibrant pink and magenta energy streams',
    theme: 'artistic, flowing energy streams, creative sparks'
  },
  'TECHNICAL': {
    palette: 'glowing blue and cyan circuit patterns',
    theme: 'technical, circuit patterns, data streams'
  },
  'SOCIAL': {
    palette: 'harmonious green and emerald auras',
    theme: 'interconnected nodes, organic patterns'
  },
  'INTEGRATION': {
    palette: 'deep purple and violet connection streams',
    theme: 'interwoven patterns, network nodes'
  },
  'COGNITIVE': {
    palette: 'warm orange and gold neural patterns',
    theme: 'brain-like structures, synaptic connections'
  },
  'OPERATIONAL': {
    palette: 'royal purple and silver mechanisms',
    theme: 'gears, efficiency symbols, flow patterns'
  }
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
    const specificElements = await generateSpecificIconElements(perk, openai);
    return specificElements;
  } catch (error) {
    console.warn('Failed to generate specific prompt, falling back to default:', error);
    const tagType = perk.tag.split(' ')[1];
    const style = TAG_STYLES[tagType];
    
    if (!style) {
      throw new Error(`Unknown tag type: ${tagType}`);
    }

    const basePrompt = `Create a World of Warcraft style ability icon with a futuristic twist. The icon should feature ${style.palette}. The icon represents "${perk.shortDescription || perk.description}". Style: ${style.theme}.`;
    
    const technicalSpecs = `The image should be a square icon with a dark border and inner glow, highly detailed in a semi-realistic style. The composition should be centered and instantly recognizable as a game ability icon while maintaining a sci-fi aesthetic.`;

    return `${basePrompt} ${technicalSpecs}`;
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
    
    const response = await openai.images.generate({
      model: "dall-e-3",
      prompt: prompt,
      n: 1,
      size: "1024x1024", // Square format is fastest
      quality: "standard", // Standard quality for faster generation
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

    // Test OpenAI connection before proceeding
    try {
      await openai.models.list();
    } catch (apiError) {
      throw new Error(`Failed to connect to OpenAI API: ${apiError instanceof Error ? apiError.message : String(apiError)}`);
    }

    // Ensure icons directory exists
    await ensureDirectory(ICONS_DIR);

    // Read and parse tech tree
    let techTree;
    try {
      console.log('Reading tech tree...');
      const techTreeContent = await fs.readFile(TECH_TREE_PATH, 'utf8');
      techTree = yaml.load(techTreeContent) as Record<string, any>;
      if (!techTree) {
        throw new Error('Tech tree file is empty or invalid');
      }
    } catch (error) {
      throw new Error(`Failed to read or parse tech tree: ${error instanceof Error ? error.message : String(error)}`);
    }

  // Extract all perks
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

  let totalPerks = 0;
  let completedPerks = 0;
  let skippedPerks = 0;
  let failedPerks = 0;

  // Process each perk
  for (const perk of perks) {
    totalPerks++;
    const iconPath = path.join(ICONS_DIR, sanitizeFilename(perk.name));
    
    try {
      // Skip if icon already exists
      if (await fileExists(iconPath)) {
        skippedPerks++;
        console.log(`Icon already exists for ${perk.name}, skipping... (${completedPerks}/${totalPerks} completed, ${skippedPerks} skipped)`);
        continue;
      }

      console.log(`Processing ${perk.name}...`);
      const imageBuffer = await generateIconWithRetry(perk, openai);
      await fs.writeFile(iconPath, imageBuffer);
      completedPerks++;
      console.log(`Successfully generated icon for ${perk.name} (${completedPerks}/${totalPerks} completed, ${skippedPerks} skipped)`);
      
      // Add a small delay between requests to avoid rate limiting
      await new Promise(resolve => setTimeout(resolve, 1000));
    } catch (error) {
      failedPerks++;
      console.error(`Failed to generate icon for ${perk.name} (${failedPerks} failed):`, error);
    }
  }

  console.log(`
Icon generation completed!
Total perks: ${totalPerks}
Successfully generated: ${completedPerks}
Skipped (already exist): ${skippedPerks}
Failed: ${failedPerks}
`);
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
