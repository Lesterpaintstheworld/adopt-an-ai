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

def generate_dalle_prompt(perk):
    """Generate DALL-E prompt based on perk data."""
    # Get description, falling back to shortDescription if available, or a default
    description = perk.get('description') or perk.get('shortDescription') or perk.get('longDescription') or perk['name']
    
    # Get tag type, with error handling
    tag = perk.get('tag', 'UNKNOWN')
    tag_type = tag.split(' ')[1] if ' ' in tag else 'UNKNOWN'
    
    style_guides = {
        'CREATIVE': 'vibrant and artistic, with warm colors and flowing designs',
        'TECHNICAL': 'technical and precise, with blue tones and geometric patterns',
        'SOCIAL': 'organic and connected, with green hues and interlinked elements',
        'INTEGRATION': 'harmonious and balanced, with purple tones and unified components',
        'COGNITIVE': 'complex and neural, with orange highlights and branching patterns',
        'OPERATIONAL': 'structured and efficient, with cyan accents and systematic layouts'
    }
    
    style_guide = style_guides.get(tag_type, 'balanced and professional, with neutral tones and clean designs')
    
    base_prompt = f"Create a World of Warcraft style ability icon with a futuristic twist. The icon represents \"{description}\". Style: {style_guide}."
    technical_specs = "The image should be a square icon with a dark border and inner glow, highly detailed in a semi-realistic style. The composition should be centered and instantly recognizable as a game ability icon while maintaining a sci-fi aesthetic."
    
    return f"{base_prompt} {technical_specs}"

def generate_icon(client: OpenAI, perk, max_retries=3):
    """Generate icon using DALL-E."""
    # Get the prompt synchronously now that generate_dalle_prompt is not async
    prompt = generate_dalle_prompt(perk)
    
    for attempt in range(max_retries):
        try:
            print(f"Generating icon for {perk['name']} (attempt {attempt + 1}/{max_retries})")
            
            response = client.images.generate(
                model="dall-e-3",
                prompt=prompt,  # Use the prompt directly
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

def main():
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
                image_data = generate_icon(client, perk)
                save_icon(image_data, perk['name'])
            except Exception as e:
                print(f"Failed to generate icon for {perk['name']}: {str(e)}")
                continue
        
        print("Icon generation complete!")
        
    except Exception as e:
        print(f"An error occurred: {str(e)}")
        raise

if __name__ == "__main__":
    main()
