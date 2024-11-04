import os
import yaml
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
            logging.FileHandler('perk_mission_generation.log'),
            logging.StreamHandler()
        ]
    )

def load_tech_tree():
    tech_tree_path = Path("content/tech/tech-tree.yml")
    try:
        with open(tech_tree_path, 'r', encoding='utf-8') as f:
            return yaml.safe_load(f)
    except Exception as e:
        logging.error(f"Error loading tech tree: {e}")
        raise

def get_perk_filename(perk_id: str, perk_name: str) -> str:
    safe_name = perk_name.lower().replace(' ', '-')
    safe_name = ''.join(c for c in safe_name if c.isalnum() or c == '-')
    return f"{safe_name}-{perk_id}"

def load_perk_details(perk_id: str, tech_tree: dict) -> dict:
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
        if not perk_path.exists():
            logging.warning(f"Perk file not found at {perk_path}")
            return None
            
        with open(perk_path, 'r', encoding='utf-8') as f:
            return yaml.safe_load(f)
    except Exception as e:
        logging.error(f"Error loading perk details for {perk_id}: {e}")
        return None

async def generate_mission(client: AsyncAnthropic, perk_data: dict, difficulty: str) -> dict:
    prompt = f"""You are designing an AI training mission that leverages a specific capability/perk.
    
    Perk Details:
    Name: {perk_data.get('name')}
    Description: {perk_data.get('description')}
    Story: {perk_data.get('story', 'No story available')}
    
    Create a {difficulty} difficulty training mission that:
    1. Uses this perk as its main prerequisite
    2. Challenges the AI to master this capability
    3. Has clear objectives and rewards
    4. Fits the theme and context of the perk
    
    Return the mission data in this YAML format:
    ```yaml
    id: [unique_id]
    title: [engaging title]
    description: [2-3 sentences describing the mission]
    difficulty: {difficulty}
    category: [Communication|Creativity|Problem Solving|Research]
    duration: [estimated time, e.g. "2h", "4h"]
    mainPrerequisite: {perk_data.get('capability_id')}
    requirements: [list of basic requirements]
    rewards:
      xp: [amount]
      capabilities: [list of new capabilities gained]
    phase: [same as the perk's phase]
    ```
    
    Return only the YAML, no additional text."""

    try:
        response = await client.messages.create(
            model="claude-3-sonnet-20240229",
            messages=[{"role": "user", "content": prompt}],
            max_tokens=1000
        )
        mission_yaml = response.content[0].text.strip()
        
        # Remove the ```yaml and ``` if present
        mission_yaml = mission_yaml.replace('```yaml', '').replace('```', '').strip()
        
        return yaml.safe_load(mission_yaml)
    except Exception as e:
        logging.error(f"Error generating mission: {e}")
        return None

def ensure_missions_directory():
    Path("content/missions").mkdir(parents=True, exist_ok=True)

def save_missions(perk_id: str, missions: list):
    missions_path = Path(f"content/missions/{perk_id}-missions.yml")
    
    try:
        with open(missions_path, 'w', encoding='utf-8') as f:
            yaml.dump(missions, f, allow_unicode=True, sort_keys=False)
            
        logging.info(f"Successfully saved missions to {missions_path}")
            
    except Exception as e:
        logging.error(f"Error saving missions for {perk_id}: {e}")

async def process_all_perks(client: AsyncAnthropic):
    tech_tree = load_tech_tree()
    ensure_missions_directory()
    processed = 0
    failed = []
    
    all_perks = []
    for phase in tech_tree.values():
        for key, value in phase.items():
            if isinstance(value, list):
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
                logging.warning(f"No details found for {perk_id}")
                failed.append(perk_id)
                continue
            
            # Generate medium and hard missions
            missions = []
            
            medium_mission = await generate_mission(client, perk_details, "Intermediate")
            if medium_mission:
                missions.append(medium_mission)
                
            hard_mission = await generate_mission(client, perk_details, "Advanced")
            if hard_mission:
                missions.append(hard_mission)
            
            if missions:
                save_missions(perk_id, missions)
                processed += 1
                logging.info(f"Successfully generated missions for {perk_id}")
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
    anthropic_api_key = os.getenv("ANTHROPIC_API_KEY")
    
    if not anthropic_api_key:
        raise ValueError("Missing required API key")
        
    client = AsyncAnthropic(api_key=anthropic_api_key)
    
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
