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

def get_perk_filename(perk_id: str, perk_name: str) -> str:
    """Generate the correct filename format for a perk"""
    # Convert name to filename-safe format
    safe_name = perk_name.lower().replace(' ', '-')
    # Remove special characters
    safe_name = ''.join(c for c in safe_name if c.isalnum() or c == '-')
    return f"{safe_name}-{perk_id}"

def load_perk_details(perk_id: str, tech_tree: dict) -> dict:
    """Load detailed perk data using the correct filename format"""
    # Find the perk in tech tree to get its name
    perk_name = None
    for phase in tech_tree.values():
        for layer in phase.values():
            if isinstance(layer, list):
                for item in layer:
                    if item.get('capability_id') == perk_id:
                        perk_name = item.get('name')
                        break
                if perk_name:
                    break
        if perk_name:
            break
    
    if not perk_name:
        logging.error(f"Could not find name for perk {perk_id} in tech tree")
        return None
        
    filename = get_perk_filename(perk_id, perk_name)
    perk_path = Path(f"content/tech/{filename}.yml")
    
    try:
        logging.info(f"Loading perk details from {perk_path}")
        if not perk_path.exists():
            logging.warning(f"Perk file not found at {perk_path}")
            return None
            
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

def get_related_capabilities(tech_tree: dict, phase_key: str, current_perk: dict) -> str:
    """Get context about other capabilities in the same phase/layer"""
    related = []
    phase = tech_tree.get(phase_key, {})
    
    for layer_key, layer_items in phase.items():
        if isinstance(layer_items, list):
            for item in layer_items:
                if (item.get('capability_id') != current_perk.get('capability_id') and
                    item.get('layer') == current_perk.get('layer')):
                    related.append(f"- {item.get('name')}: {item.get('description', '')}")
    
    return "\n".join(related)

async def generate_story(client: AsyncAnthropic, perk_data: dict, tech_tree: dict) -> str:
    """Generate a story for a perk using Claude"""
    
    # Extract phase and layer from capability_id
    phase_key = f"phase_{perk_data['capability_id'].split('_')[1][1]}"
    
    # Build richer context
    phase_context = get_phase_context(tech_tree, phase_key)
    prereq_context = get_prerequisites_context(tech_tree, perk_data.get('prerequisites', []))
    related_capabilities = get_related_capabilities(tech_tree, phase_key, perk_data)
    
    # Get layer name from capability_id prefix
    layer_mapping = {
        'COM': 'Compute Layer - Foundation of processing and resources',
        'MOD': 'Model Layer - Core AI capabilities and cognition', 
        'AGT': 'Agent Layer - Individual AI behavior and autonomy',
        'APP': 'Application Layer - Practical tools and interfaces',
        'ECO': 'Ecosystem Layer - Collaborative systems and frameworks',
        'MLT': 'Multi-Agent Layer - Coordination between AI entities'
    }
    layer_prefix = perk_data['capability_id'].split('_')[0]
    layer_context = layer_mapping.get(layer_prefix, 'Unknown Layer')
    
    prompt = f"""You are writing a narrative story about the development and real-world impact of AI capabilities 
    within the Great Convergence framework - a vision of AI evolution through distinct phases toward harmonious integration.

    This capability exists within:
    Layer: {layer_context}
    Phase Context: {phase_context}
    
    This positioning means the capability should reflect the appropriate level of advancement and integration
    for its phase, while fulfilling its layer's specific role in the overall AI stack.

    Capability Details:
    Name: {perk_data['name']}
    Technical Description: {perk_data.get('description', '')}
    Technical Specifications: {json.dumps(perk_data.get('technical_specifications', {}), indent=2)}
    
    Prerequisites and Their Context:
    {prereq_context}
    
    Related Capabilities in Same Phase:
    {related_capabilities}

    Write a 5-6 paragraph story that:
    1. Opens with a specific example of how this capability is being used in practice, appropriate to its phase and layer
    2. Explains the technical foundations and how it builds upon prerequisites within its layer
    3. Describes its immediate impact on AI systems through concrete examples, highlighting its role in the layer
    4. Explores real-world applications and benefits through specific use cases aligned with the phase goals
    5. Concludes with near-term possibilities it enables, showing progression toward the next phase
    
    Guidelines:
    - Frame the capability within its specific layer's purpose and phase's level of advancement
    - Use concrete examples and specific scenarios rather than abstract concepts
    - Include technical details but explain them through practical applications
    - Focus on realistic outcomes rather than speculative possibilities
    - Maintain a professional but engaging tone
    - Include relevant metrics and measurements where appropriate
    - Reference how actual organizations or industries might utilize this capability
    - Show how it contributes to the broader goals of its phase and layer
    
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

def save_perk_with_story(perk_id: str, perk_name: str, story: str):
    """Save the generated story using the correct filename format"""
    filename = get_perk_filename(perk_id, perk_name)
    perk_path = Path(f"content/tech/{filename}.yml")
    
    try:
        if not perk_path.exists():
            perk_data = {
                'capability_id': perk_id,
                'name': perk_name
            }
        else:
            with open(perk_path, 'r', encoding='utf-8') as f:
                perk_data = yaml.safe_load(f) or {}
        
        perk_data['story'] = story
        
        with open(perk_path, 'w', encoding='utf-8') as f:
            yaml.dump(perk_data, f, allow_unicode=True, sort_keys=False)
            
        logging.info(f"Successfully saved story to {perk_path}")
            
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
            perk_details = load_perk_details(perk_id, tech_tree)
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
                perk_name = perk.get('name')  # Get name from the perk data
                if perk_name:
                    save_perk_with_story(perk_id, perk_name, story)
                    processed += 1
                    logging.info(f"Successfully generated story for {perk_id}")
                else:
                    logging.error(f"Missing name for perk {perk_id}")
                    failed.append(perk_id)
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
