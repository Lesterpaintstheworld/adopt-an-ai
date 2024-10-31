/// <reference types="node" />
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
    const prompt = await generateDallePrompt(perk);
    
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

async function generateDallePrompt(perk: Perk): Promise<string> {
  const tagType = perk.tag.split(' ')[1];
  let styleGuide = '';
  
  switch (tagType) {
    case 'CREATIVE':
      styleGuide = 'vibrant and artistic, with warm colors and flowing designs';
      break;
    case 'TECHNICAL':
      styleGuide = 'technical and precise, with blue tones and geometric patterns';
      break;
    case 'SOCIAL':
      styleGuide = 'organic and connected, with green hues and interlinked elements';
      break;
    case 'INTEGRATION':
      styleGuide = 'harmonious and balanced, with purple tones and unified components';
      break;
    case 'COGNITIVE':
      styleGuide = 'complex and neural, with orange highlights and branching patterns';
      break;
    case 'OPERATIONAL':
      styleGuide = 'structured and efficient, with cyan accents and systematic layouts';
      break;
    default:
      styleGuide = 'balanced and professional, with neutral tones and clean designs';
  }

  const basePrompt = `Create a World of Warcraft style ability icon with a futuristic twist. The icon represents "${perk.shortDescription || perk.description}". Style: ${styleGuide}.`;
  
  const technicalSpecs = `The image should be a square icon with a dark border and inner glow, highly detailed in a semi-realistic style. The composition should be centered and instantly recognizable as a game ability icon while maintaining a sci-fi aesthetic.`;

  return `${basePrompt} ${technicalSpecs}`;
}


