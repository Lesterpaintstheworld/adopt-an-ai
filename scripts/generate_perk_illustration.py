import os
import yaml
import asyncio
import logging
from pathlib import Path
from anthropic import AsyncAnthropic
from openai import AsyncOpenAI
from dotenv import load_dotenv
from PIL import Image
import io

def setup_logging():
    logging.basicConfig(
        level=logging.INFO,
        format='%(asctime)s - %(levelname)s - %(message)s',
        handlers=[
            logging.FileHandler('perk_illustration_generation.log'),
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

async def generate_scene_description(client: AsyncAnthropic, story: str) -> str:
    prompt = f"""You are a visual director creating a striking scene from a story.
    Read this story about an AI capability and select the most visually compelling moment to illustrate:

    {story}

    Describe a single powerful scene that captures the essence of this capability in action.
    Focus on visual elements that would make an impactful illustration.
    Write a clear, detailed description of the scene in 3-4 sentences.
    Include details about perspective, lighting, mood, and key visual elements.
    
    Return only the scene description, no additional commentary."""

    try:
        response = await client.messages.create(
            model="claude-3-sonnet-20240229",
            messages=[{"role": "user", "content": prompt}],
            max_tokens=500
        )
        return response.content[0].text.strip()
    except Exception as e:
        logging.error(f"Error generating scene: {e}")
        return None

async def generate_dalle_prompt(client: AsyncAnthropic, scene: str) -> str:
    prompt = f"""You are an art director creating DALL-E prompts for futuristic illustrations.
    Convert this scene description into a detailed DALL-E prompt:

    {scene}

    The style should be:
    - Futuristic cel-shaded comic book art
    - Clean lines and bold colors
    - Dramatic lighting and dynamic compositions
    - High-tech, sleek aesthetic
    - 2:1 aspect ratio cinematic composition

    Write a detailed, specific prompt that will generate a consistent style.
    Include key visual elements, perspective, lighting, and mood.
    Use technical art terminology to guide the style.
    
    Return only the DALL-E prompt, no additional text."""

    try:
        response = await client.messages.create(
            model="claude-3-sonnet-20240229",
            messages=[{"role": "user", "content": prompt}],
            max_tokens=500
        )
        return response.content[0].text.strip()
    except Exception as e:
        logging.error(f"Error generating DALL-E prompt: {e}")
        return None

async def generate_illustration(dalle_client: AsyncOpenAI, prompt: str) -> bytes:
    try:
        response = await dalle_client.images.generate(
            model="dall-e-3",
            prompt=prompt,
            size="1792x1024",
            quality="hd",
            n=1
        )
        
        # Get the URL of the generated image
        image_url = response.data[0].url
        
        # Download the image
        async with dalle_client.get(image_url) as resp:
            return await resp.read()
            
    except Exception as e:
        logging.error(f"Error generating illustration: {e}")
        return None

def ensure_illustration_directory():
    Path("content/perk_illustrations").mkdir(parents=True, exist_ok=True)

def save_illustration(image_data: bytes, perk_id: str, perk_name: str):
    filename = get_perk_filename(perk_id, perk_name)
    illustration_path = Path(f"content/perk_illustrations/{filename}.png")
    
    try:
        # Save the raw image
        with open(illustration_path, 'wb') as f:
            f.write(image_data)
            
        logging.info(f"Successfully saved illustration to {illustration_path}")
            
    except Exception as e:
        logging.error(f"Error saving illustration for {perk_id}: {e}")

def save_perk_with_scene(perk_id: str, perk_name: str, scene: str, prompt: str):
    filename = get_perk_filename(perk_id, perk_name)
    perk_path = Path(f"content/tech/{filename}.yml")
    
    try:
        with open(perk_path, 'r', encoding='utf-8') as f:
            perk_data = yaml.safe_load(f) or {}
        
        perk_data['scene'] = scene
        perk_data['image_prompt'] = prompt
        
        with open(perk_path, 'w', encoding='utf-8') as f:
            yaml.dump(perk_data, f, allow_unicode=True, sort_keys=False)
            
        logging.info(f"Successfully saved scene and prompt to {perk_path}")
            
    except Exception as e:
        logging.error(f"Error saving scene for {perk_id}: {e}")

async def process_all_perks(anthropic_client: AsyncAnthropic, dalle_client: AsyncOpenAI):
    tech_tree = load_tech_tree()
    ensure_illustration_directory()
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
            if not perk_details or not perk_details.get('story'):
                logging.warning(f"No story found for {perk_id}")
                failed.append(perk_id)
                continue
                
            # Generate scene description
            scene = await generate_scene_description(anthropic_client, perk_details['story'])
            if not scene:
                failed.append(perk_id)
                continue
                
            # Generate DALL-E prompt
            prompt = await generate_dalle_prompt(anthropic_client, scene)
            if not prompt:
                failed.append(perk_id)
                continue
                
            # Save scene and prompt to perk file
            perk_name = perk.get('name')
            if perk_name:
                save_perk_with_scene(perk_id, perk_name, scene, prompt)
                
                # Generate and save illustration
                illustration = await generate_illustration(dalle_client, prompt)
                if illustration:
                    save_illustration(illustration, perk_id, perk_name)
                    processed += 1
                    logging.info(f"Successfully generated illustration for {perk_id}")
                else:
                    failed.append(perk_id)
            else:
                logging.error(f"Missing name for perk {perk_id}")
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
    openai_api_key = os.getenv("OPENAI_API_KEY")
    
    if not anthropic_api_key or not openai_api_key:
        raise ValueError("Missing required API keys")
        
    anthropic_client = AsyncAnthropic(api_key=anthropic_api_key)
    dalle_client = AsyncOpenAI(api_key=openai_api_key)
    
    # Process all perks
    processed, failed = await process_all_perks(anthropic_client, dalle_client)
    
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
