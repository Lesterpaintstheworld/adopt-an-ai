import os
import yaml
import json
import asyncio
import logging
from pathlib import Path
from anthropic import AsyncAnthropic
from dotenv import load_dotenv

def setup_logging():
    logging.basicConfig(
        level=logging.INFO,
        format='%(asctime)s - %(levelname)s - %(message)s',
        handlers=[
            logging.FileHandler('perk_story_generation.log'),
            logging.StreamHandler()
        ]
    )

def load_tech_tree():
    """Load the tech tree with enhanced context handling"""
    tech_tree_path = Path("content/tech/tech-tree.yml")
    try:
        with open(tech_tree_path, 'r', encoding='utf-8') as f:
            return yaml.safe_load(f)
    except Exception as e:
        logging.error(f"Error loading tech tree: {e}")
        raise

def load_perk_details(perk_id: str) -> dict:
    """Load detailed perk data from its YAML file"""
    perk_path = Path(f"content/tech/{perk_id}.yml")
    try:
        with open(perk_path, 'r', encoding='utf-8') as f:
            return yaml.safe_load(f)
    except Exception as e:
        logging.error(f"Error loading perk details for {perk_id}: {e}")
        return None

def get_phase_context(tech_tree: dict, phase_key: str) -> str:
    """Extract relevant context from the phase"""
    phase = tech_tree.get(phase_key, {})
    return f"""
    Phase: {phase.get('name', '')}
    Period: {phase.get('period', '')}
    Description: {phase.get('description', '')}
    """

def get_prerequisites_context(tech_tree: dict, prerequisites: list) -> str:
    """Get context about prerequisites"""
    prereq_context = []
    for prereq in prerequisites:
        # Find prerequisite in tech tree
        for phase in tech_tree.values():
            for layer in phase.values():
                if isinstance(layer, list):
                    for item in layer:
                        if item.get('name') == prereq:
                            prereq_context.append(f"- {prereq}: {item.get('description', '')}")
    return "\n".join(prereq_context)

async def generate_story(client: AsyncAnthropic, perk_data: dict, tech_tree: dict) -> str:
    """Generate a story for a perk using Claude"""
    
    # Extract phase and layer from capability_id
    phase_key = f"phase_{perk_data['capability_id'].split('_')[1][1]}"
    
    # Build context
    phase_context = get_phase_context(tech_tree, phase_key)
    prereq_context = get_prerequisites_context(tech_tree, perk_data.get('prerequisites', []))
    
    prompt = f"""You are writing a narrative story about the development and impact of AI capabilities.
    Write a compelling 5-6 paragraph story about this AI capability:

    Capability Name: {perk_data['name']}
    Technical Description: {perk_data.get('description', '')}
    Technical Specifications: {json.dumps(perk_data.get('technical_specifications', {}), indent=2)}
    
    Phase Context:
    {phase_context}
    
    Prerequisites and Their Context:
    {prereq_context}

    Write a story that:
    1. Introduces the capability and its significance
    2. Explains how it builds upon prerequisites
    3. Describes its immediate effects on AI systems
    4. Explores its broader implications for AI development
    5. Concludes with future possibilities it enables
    
    Make it engaging and accessible while maintaining technical accuracy.
    Focus on the transformative aspects and real-world implications.
    Use a professional but engaging tone.
    
    Return only the story text, no additional formatting or metadata."""

    try:
        response = await client.messages.create(
            model="claude-3-sonnet-20240229",
            messages=[{"role": "user", "content": prompt}],
            max_tokens=2000
        )
        return response.content[0].text.strip()
    except Exception as e:
        logging.error(f"Error generating story: {e}")
        return None

def save_perk_with_story(perk_id: str, story: str):
    """Save the generated story back to the perk's YAML file"""
    perk_path = Path(f"content/tech/{perk_id}.yml")
    try:
        with open(perk_path, 'r', encoding='utf-8') as f:
            perk_data = yaml.safe_load(f)
        
        perk_data['story'] = story
        
        with open(perk_path, 'w', encoding='utf-8') as f:
            yaml.dump(perk_data, f, allow_unicode=True, sort_keys=False)
            
    except Exception as e:
        logging.error(f"Error saving story for {perk_id}: {e}")

async def process_all_perks(client: AsyncAnthropic):
    """Process all perks in the tech tree"""
    tech_tree = load_tech_tree()
    processed = 0
    failed = []
    
    # Get all perks from tech tree
    all_perks = []
    for phase in tech_tree.values():
        for key, value in phase.items():
            if isinstance(value, list):  # Layer containing perks
                all_perks.extend(value)

    total_perks = len(all_perks)
    logging.info(f"Found {total_perks} perks to process")

    for perk in all_perks:
        perk_id = perk.get('capability_id')
        if not perk_id:
            continue
            
        try:
            logging.info(f"Processing {perk_id} ({processed + 1}/{total_perks})")
            
            # Load full perk details
            perk_details = load_perk_details(perk_id)
            if not perk_details:
                failed.append(perk_id)
                continue
                
            # Check if story already exists and skip if needed
            if 'story' in perk_details:
                logging.info(f"Story already exists for {perk_id}, skipping...")
                processed += 1
                continue
                
            # Generate story
            story = await generate_story(client, perk_details, tech_tree)
            if story:
                save_perk_with_story(perk_id, story)
                processed += 1
                logging.info(f"Successfully generated story for {perk_id}")
            else:
                failed.append(perk_id)
                
            # Add a small delay to avoid rate limiting
            await asyncio.sleep(2)
            
        except Exception as e:
            logging.error(f"Error processing {perk_id}: {e}")
            failed.append(perk_id)
            
    return processed, failed

async def main():
    setup_logging()
    
    # Load environment variables
    load_dotenv()
    api_key = os.getenv("ANTHROPIC_API_KEY")
    if not api_key:
        raise ValueError("ANTHROPIC_API_KEY not found in environment variables")
        
    client = AsyncAnthropic(api_key=api_key)
    
    # Process all perks
    processed, failed = await process_all_perks(client)
    
    # Print summary
    logging.info(f"\nGeneration Summary:")
    logging.info(f"Successfully processed: {processed}")
    logging.info(f"Failed: {len(failed)}")
    if failed:
        logging.info("Failed perks:")
        for perk_id in failed:
            logging.info(f"- {perk_id}")

if __name__ == "__main__":
    asyncio.run(main())
