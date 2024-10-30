import { Perk } from '../types/tech.js';
import OpenAI from 'openai';
import fs from 'fs/promises';
import path from 'path';

const ICONS_DIR = path.join(process.cwd(), 'public', 'perk-icons');

// Ensure the icons directory exists
const ensureIconsDirectory = async () => {
  try {
    await fs.access(ICONS_DIR);
  } catch {
    await fs.mkdir(ICONS_DIR, { recursive: true });
  }
};

// Convert perk name to valid filename
const getPerkIconFilename = (perkName: string): string => {
  return `${perkName.toLowerCase().replace(/[^a-z0-9]/g, '-')}.png`;
};

// Get the full path for a perk's icon
const getPerkIconPath = (perkName: string): string => {
  return path.join(ICONS_DIR, getPerkIconFilename(perkName));
};

// Check if icon already exists
const iconExists = async (perkName: string): Promise<boolean> => {
  try {
    await fs.access(getPerkIconPath(perkName));
    return true;
  } catch {
    return false;
  }
};

// Generate and save icon for a perk
async function generateIcon(perk: Perk, openai: OpenAI): Promise<Buffer> {
  try {
    const prompt = await generateDallePrompt(perk, openai);
    
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

export async function generateAndSaveIcon(perk: Perk, openai: OpenAI): Promise<string> {
  try {
    await ensureIconsDirectory();
    const iconPath = getPerkIconPath(perk.name);
    
    // Check if icon already exists
    if (await iconExists(perk.name)) {
      console.log(`Icon already exists for ${perk.name}`);
      return iconPath;
    }

    console.log(`Generating icon for ${perk.name}...`);
    const imageBuffer = await generateIcon(perk, openai);
    console.log(`Writing icon to ${iconPath}...`);
    await fs.writeFile(iconPath, imageBuffer);
    return iconPath;
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    throw new Error(`Failed to generate/save icon for ${perk.name}: ${errorMessage}`);
  }
}

export async function generateAndSaveIconWithRetry(
  perk: Perk,
  openai: OpenAI,
  maxRetries = 3
): Promise<string> {
  let lastError: Error | null = null;
  
  for (let i = 0; i < maxRetries; i++) {
    try {
      console.log(`Attempt ${i + 1}/${maxRetries} for ${perk.name}`);
      return await generateAndSaveIcon(perk, openai);
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

// Get the URL for a perk's icon (for use in the frontend)
export const getPerkIconUrl = (perkName: string): string => {
  return `/perk-icons/${getPerkIconFilename(perkName)}`;
};

async function generateDallePrompt(perk: Perk, openai: OpenAI): Promise<string> {
  const tagType = perk.tag.split(' ')[1];
  const style = TAG_STYLES[tagType];
  
  if (!style) {
    throw new Error(`Unknown tag type: ${tagType}`);
  }

  const basePrompt = `Create a World of Warcraft style ability icon with a futuristic twist. The icon should feature ${style.palette}. The icon represents "${perk.shortDescription || perk.description}". Style: ${style.theme}.`;
  
  const technicalSpecs = `The image should be a square icon with a dark border and inner glow, highly detailed in a semi-realistic style. The composition should be centered and instantly recognizable as a game ability icon while maintaining a sci-fi aesthetic.`;

  return `${basePrompt} ${technicalSpecs}`;
}



const generateSpecificIconElements = async (perk: Perk, openai: OpenAI): Promise<string> => {
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
      model: "gpt-4o",
      messages: [{ role: "user", content: prompt }],
      temperature: 0.7,
      max_tokens: 150
    });

    return completion.choices[0].message.content || getDefaultVisualElements(perk);
  } catch (error) {
    console.error('Failed to generate prompt with GPT-4o:', error);
    return getDefaultVisualElements(perk);
  }
};

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

interface TagStyle {
  background: string;
  color: string;
  palette: string;
  theme: string;
}

const TAG_STYLES: { [key: string]: TagStyle } = {
  'CREATIVE': {
    background: '#FFE0E9',
    color: '#D81B60',
    palette: 'vibrant pink and magenta energy streams with creative sparks',
    theme: 'artistic, flowing energy streams, creative sparks'
  },
  'TECHNICAL': {
    background: '#E3F2FD',
    color: '#1976D2',
    palette: 'glowing blue and cyan circuit patterns',
    theme: 'technical, circuit patterns, data streams'
  },
  'SOCIAL': {
    background: '#E8F5E9',
    color: '#388E3C',
    palette: 'harmonious green and emerald auras',
    theme: 'interconnected nodes, organic patterns'
  },
  'INTEGRATION': {
    background: '#EDE7F6',
    color: '#5E35B1',
    palette: 'deep purple and violet connection streams',
    theme: 'interwoven patterns, network nodes'
  },
  'COGNITIVE': {
    background: '#FFF3E0',
    color: '#E65100',
    palette: 'warm orange and gold neural patterns',
    theme: 'brain-like structures, synaptic connections'
  },
  'OPERATIONAL': {
    background: '#F3E5F5',
    color: '#7B1FA2',
    palette: 'royal purple and silver mechanisms',
    theme: 'gears, efficiency symbols, flow patterns'
  }
};

