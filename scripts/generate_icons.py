import os
import yaml
import base64
from pathlib import Path
from openai import OpenAI
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

# Constants
ICONS_DIR = Path("public/perk-icons")
TECH_TREE_PATH = Path("content/tech/tech-tree.yml")

def ensure_icons_directory():
    """Create the icons directory if it doesn't exist."""
    ICONS_DIR.mkdir(parents=True, exist_ok=True)

def get_perk_icon_filename(perk_name: str) -> str:
    """Convert perk name to valid filename."""
    return f"{perk_name.lower().replace(' ', '-').replace('/', '-')}.png"

def icon_exists(perk_name: str) -> bool:
    """Check if icon already exists."""
    return (ICONS_DIR / get_perk_icon_filename(perk_name)).exists()

async def generate_dalle_prompt(ai, client: OpenAI):
    """Generate DALL-E prompt using GPT-4."""
    base_style = get_base_style_prompt()
    personality_style = get_personality_style(ai['personalityType'])
    specialization_elements = get_specialization_elements(ai['specialization'])
    
    unique_traits = ai['details'].get('uniqueTraits', '')
    role = ai['details'].get('role', '')

    prompt = f"""You are an expert at creating DALL-E image generation prompts.
Generate a detailed prompt for an AI entity's profile picture with these specific requirements:

Character Details:
Name: {ai['name']}
Role: {role}
Key Trait: {unique_traits}

Base Style Requirements:
{base_style}

Personality-Specific Style:
{personality_style}

Specialization Elements:
{specialization_elements}

Additional Requirements:
- Make the image instantly recognizable and distinct from other AI profiles
- Ensure the main visual metaphor clearly represents {ai['name']}'s role as {role}
- Maintain professional quality suitable for a profile picture
- Create a memorable and iconic representation
- Keep the style consistent with other Synthetic Souls AI profiles

Focus on creating a distinctive visual representation that captures this AI entity's essence while maintaining the shared visual language of the Synthetic Souls team.
Be specific but concise. Do not include technical specifications or image size requirements."""

    try:
        completion = client.chat.completions.create(
            model="gpt-4",
            messages=[
                {"role": "system", "content": "You are an expert at creating DALL-E image generation prompts."},
                {"role": "user", "content": prompt}
            ],
            temperature=0.7,
            max_tokens=150
        )
        
        dalle_prompt = completion.choices[0].message.content
        
        # Add technical specifications
        technical_specs = "The image should be a high-quality portrait format with professional lighting and composition, 1024x1024 resolution, suitable for a profile picture. Maintain a clean, modern aesthetic with subtle technological elements."
        
        return f"{dalle_prompt} {technical_specs}"
        
    except Exception as e:
        print(f"Error generating GPT-4 prompt for {perk['name']}: {str(e)}")
        # Fall back to basic prompt generation if GPT-4 fails
        return generate_basic_dalle_prompt(perk)

def generate_basic_dalle_prompt(perk):
    """Fallback function for basic DALL-E prompt generation."""
    # Get description, with proper error handling using .get()
    description = None
    for field in ['shortDescription', 'description', 'longDescription']:
        description = perk.get(field)
        if description:
            break
    
    # If no description found, use name
    if not description:
        description = perk['name']
    
    # Get tag type, with error handling
    tag = perk.get('tag', 'UNKNOWN')
    tag_type = tag.split(' ')[1] if ' ' in tag else 'UNKNOWN'
    
    style_guides = {
        'CREATIVE': 'vibrant and artistic, with a glowing central symbol surrounded by warm, flowing energy',
        'TECHNICAL': 'technical and precise, with a prominent geometric central element in blue tones',
        'SOCIAL': 'organic and connected, with a central networking symbol in bright green hues',
        'INTEGRATION': 'harmonious and balanced, with a central unified symbol in purple tones',
        'COGNITIVE': 'complex and neural, with a prominent brain-inspired central element in orange',
        'OPERATIONAL': 'structured and efficient, with a central mechanical symbol in cyan accents'
    }
    
    style_guide = style_guides.get(tag_type, 'balanced and professional, with a clear central symbol in neutral tones')
    
    base_prompt = f"Create a World of Warcraft style ability icon with a futuristic twist. The icon features a large, prominent central symbol representing \"{description}\". Style: {style_guide}."
    technical_specs = "The image should be a square icon with a dark border and inner glow, highly detailed in a semi-realistic style. The central element should occupy 60-70% of the space, with supporting elements enhancing but not overwhelming the main focus."
    
    return f"{base_prompt} {technical_specs}"

async def generate_icon(client: OpenAI, perk, max_retries=3):
    """Generate icon using DALL-E."""
    # Get the prompt using GPT-4
    prompt = await generate_dalle_prompt(perk, client)
    
    for attempt in range(max_retries):
        try:
            print(f"Generating icon for {perk['name']} (attempt {attempt + 1}/{max_retries})")
            
            # Use generate() without await since it's synchronous
            response = client.images.generate(
                model="dall-e-3",
                prompt=prompt,
                n=1,
                size="1024x1024",
                response_format="b64_json"
            )
            
            if not response.data[0].b64_json:
                raise Exception("No image data received from OpenAI")
            
            return base64.b64decode(response.data[0].b64_json)
            
        except Exception as e:
            print(f"Attempt {attempt + 1} failed: {str(e)}")
            if attempt == max_retries - 1:
                raise
            print("Retrying...")

def save_icon(image_data: bytes, perk_name: str):
    """Save the generated icon to disk."""
    filepath = ICONS_DIR / get_perk_icon_filename(perk_name)
    filepath.write_bytes(image_data)
    print(f"Saved icon to {filepath}")

def process_perks(tech_tree_data):
    """Extract all perks from tech tree data."""
    perks = []
    for phase in tech_tree_data.values():
        for key, value in phase.items():
            if key not in ['name', 'period', 'description']:
                perks.extend(value)
    return perks

async def main():
    try:
        # Ensure we have an OpenAI API key
        if not os.getenv('OPENAI_API_KEY'):
            raise ValueError("OPENAI_API_KEY environment variable is not set")
        
        # Create OpenAI client
        client = OpenAI()
        
        # Ensure icons directory exists
        ensure_icons_directory()
        
        # Load tech tree data
        print("Loading tech tree data...")
        with open(TECH_TREE_PATH, 'r', encoding='utf-8') as f:
            tech_tree_data = yaml.safe_load(f)
        
        # Process all perks
        perks = process_perks(tech_tree_data)
        print(f"Found {len(perks)} perks to process")
        
        # Generate icons for each perk
        for perk in perks:
            if icon_exists(perk['name']):
                print(f"Icon already exists for {perk['name']}, skipping...")
                continue
            
            try:
                image_data = await generate_icon(client, perk)
                save_icon(image_data, perk['name'])
            except Exception as e:
                print(f"Failed to generate icon for {perk['name']}: {str(e)}")
                continue
        
        print("Icon generation complete!")
        
    except Exception as e:
        print(f"An error occurred: {str(e)}")
        raise

if __name__ == "__main__":
    import asyncio
    asyncio.run(main())
