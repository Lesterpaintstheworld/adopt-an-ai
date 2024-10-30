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
// Add a function to generate fallback icons for error cases
const generateFallbackIcon = (perk: Perk): string => {
  const canvas = document.createElement('canvas');
  canvas.width = 128;
  canvas.height = 128;
  const ctx = canvas.getContext('2d');
  if (!ctx) return '';

  // Get tag style for colors
  const tagType = perk.tag.split(' ')[1];
  const style = TAG_STYLES[tagType];

  // Draw gradient background
  const gradient = ctx.createLinearGradient(0, 0, 128, 128);
  gradient.addColorStop(0, style.background);
  gradient.addColorStop(1, style.color);
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, 128, 128);

  // Add perk initials
  ctx.fillStyle = '#ffffff';
  ctx.font = 'bold 48px Arial';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  const initials = perk.name
    .split(' ')
    .map(word => word[0])
    .join('')
    .substring(0, 2);
  ctx.fillText(initials, 64, 64);

  return canvas.toDataURL();
};

// Add error handling and retry logic
const generateAndSaveIconWithRetry = async (
  perk: Perk,
  openaiApiKey: string,
  maxRetries = 3
): Promise<string> => {
  for (let i = 0; i < maxRetries; i++) {
    try {
      return await generateAndSaveIcon(perk, openaiApiKey);
    } catch (error) {
      console.error(`Attempt ${i + 1} failed for ${perk.name}:`, error);
      if (i === maxRetries - 1) {
        // Use fallback on final retry
        const fallbackIcon = generateFallbackIcon(perk);
        const iconPath = getPerkIconPath(perk.name);
        await fs.writeFile(iconPath, fallbackIcon.split(',')[1], 'base64');
        return iconPath;
      }
      // Wait before retrying
      await new Promise(resolve => setTimeout(resolve, 2000 * (i + 1)));
    }
  }
  throw new Error('Should never reach here due to fallback');
};

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

  return generateAndSaveIconWithRetry(perk, openaiApiKey);
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
  palette: string; // Color description for the prompt
  theme: string;  // Visual theme elements for the prompt
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

export const generateDallePrompt = async (perk: Perk, openai: OpenAI): Promise<string> => {
  const tagType = perk.tag.split(' ')[1];
  const style = TAG_STYLES[tagType];
  
  if (!style) {
    throw new Error(`Unknown tag type: ${tagType}`);
  }

  // Base composition elements
  const basePrompt = `Create a World of Warcraft style ability icon with a futuristic twist. The icon should feature ${style.palette}. The icon represents "${perk.shortDescription || perk.description}". Style: ${style.theme}.`;

  // Get specific visual elements using GPT-4
  const specificElements = await generateSpecificIconElements(perk, openai);

  // Composition and technical requirements
  const technicalSpecs = `The image should be a square icon with a dark border and inner glow, highly detailed in a semi-realistic style. The composition should be centered and instantly recognizable as a game ability icon while maintaining a sci-fi aesthetic. The image should be 1024x1024 pixels with high contrast and clear details.`;

  return `${basePrompt} ${specificElements} ${technicalSpecs}`;
};
