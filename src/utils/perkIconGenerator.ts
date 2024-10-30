import { Perk } from '../types/tech';
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
export const generateAndSaveIcon = async (
  perk: Perk, 
  openaiApiKey: string
): Promise<string> => {
  await ensureIconsDirectory();
  
  const iconPath = getPerkIconPath(perk.name);
  
  // Check if icon already exists
  if (await iconExists(perk.name)) {
    return iconPath;
  }

  const openai = new OpenAI({ apiKey: openaiApiKey });
  const prompt = generateDallePrompt(perk);

  try {
    const response = await openai.images.generate({
      model: "dall-e-3",
      prompt: prompt,
      n: 1,
      size: "1024x1024",
    });

    if (!response.data[0]?.url) {
      throw new Error('No image URL in DALL-E response');
    }

    // Download the image
    const imageResponse = await fetch(response.data[0].url);
    const imageBuffer = await imageResponse.arrayBuffer();
    
    // Save the image
    await fs.writeFile(iconPath, Buffer.from(imageBuffer));
    
    return iconPath;
  } catch (error) {
    console.error(`Failed to generate icon for ${perk.name}:`, error);
    throw error;
  }
};

// Get the URL for a perk's icon (for use in the frontend)
export const getPerkIconUrl = (perkName: string): string => {
  return `/perk-icons/${getPerkIconFilename(perkName)}`;
};

interface TagStyle {
  background: string;
  color: string;
  palette: string; // Color description for the prompt
  theme: string;  // Visual theme elements for the prompt
}

const TAG_STYLES: { [key: string]: TagStyle } = {
  'CREATIVE': {
    background: '#FFE0E9',
    color: '#D81B60',
    palette: 'vibrant pink and magenta energy',
    theme: 'artistic, flowing energy streams, creative sparks'
  },
  'TECHNICAL': {
    background: '#E3F2FD',
    color: '#1976D2',
    palette: 'glowing blue and cyan circuits',
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
    palette: 'deep purple and violet connections',
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


const generateSpecificIconElements = (perk: Perk): string => {
  // Add specific visual elements based on perk name and description
  const nameKeywords = perk.name.toLowerCase();
  
  if (nameKeywords.includes('quantum')) {
    return 'quantum particles, wave patterns, and energy fields';
  }
  if (nameKeywords.includes('consciousness') || nameKeywords.includes('mind')) {
    return 'glowing neural networks, consciousness representations, and energy waves';
  }
  if (nameKeywords.includes('reality')) {
    return 'warped space-time, reality fragments, and dimensional portals';
  }
  if (nameKeywords.includes('resource')) {
    return 'flowing resources, energy crystals, and optimization symbols';
  }
  if (nameKeywords.includes('creation')) {
    return 'manifestation symbols, creative energy, and construction elements';
  }
  if (nameKeywords.includes('harmony') || nameKeywords.includes('unity')) {
    return 'balanced geometric patterns, unified elements, and harmonic waves';
  }
  if (nameKeywords.includes('collaboration') || nameKeywords.includes('collective')) {
    return 'interconnected nodes, collaborative symbols, and shared energy fields';
  }
  
  // Default elements if no specific keywords match
  return 'futuristic symbols, energy patterns, and technological elements';
}

export const generateDallePrompt = (perk: Perk): string => {
  const basePrompt = generateIconPrompt(perk);
  return `${basePrompt} The image should be 1024x1024 pixels, centered composition, with high contrast and clear details.`;
}
