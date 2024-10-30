import { Perk } from '../types/tech';

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

const generateIconPrompt = (perk: Perk): string => {
  const tagType = perk.tag.split(' ')[1];
  const style = TAG_STYLES[tagType];
  
  if (!style) {
    throw new Error(`Unknown tag type: ${tagType}`);
  }

  return `Create a World of Warcraft style ability icon with a futuristic twist, featuring ${style.palette}. The icon represents "${perk.shortDescription || perk.description}". Style: ${style.theme}. The image should be a square icon with a dark border and inner glow, highly detailed in a semi-realistic style, featuring ${generateSpecificIconElements(perk)}. The overall composition should be instantly recognizable as a game ability icon while maintaining a sci-fi aesthetic.`;
}

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
