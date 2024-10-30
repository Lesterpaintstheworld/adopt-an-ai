import dotenv from 'dotenv';
import techTree from '../content/tech/tech-tree.yml';
import { generateAndSaveIcon } from '../src/utils/perkIconGenerator';

dotenv.config();

const generateAllIcons = async () => {
  const openaiApiKey = process.env.OPENAI_API_KEY;
  if (!openaiApiKey) {
    throw new Error('OPENAI_API_KEY not found in environment variables');
  }

  // Extract all perks from the tech tree
  const perks = Object.values(techTree).flatMap((phase: any) =>
    Object.entries(phase)
      .filter(([key]) => !['name', 'period', 'description'].includes(key))
      .flatMap(([_, items]: [string, any]) => items)
  );

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
    }
  }
};

generateAllIcons().catch(console.error);
