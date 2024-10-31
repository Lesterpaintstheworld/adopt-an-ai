import os
import yaml
import base64
from pathlib import Path
from openai import OpenAI
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

# Constants
PROFILE_PICS_DIR = Path("public/ai-profiles")
MOCK_AIS_PATH = Path("src/data/mockAIs.ts")

def ensure_profile_directory():
    """Create the profile pictures directory if it doesn't exist."""
    PROFILE_PICS_DIR.mkdir(parents=True, exist_ok=True)

def get_profile_filename(ai_name: str) -> str:
    """Convert AI name to valid filename."""
    return f"{ai_name.lower().replace(' ', '-').replace('/', '-')}.png"

def profile_exists(ai_name: str) -> bool:
    """Check if profile picture already exists."""
    return (PROFILE_PICS_DIR / get_profile_filename(ai_name)).exists()

async def generate_dalle_prompt(ai, client: OpenAI):
    """Generate DALL-E prompt using GPT-4o."""
    prompt = f"""You are an expert at creating DALL-E image generation prompts.
Generate a detailed prompt for an AI entity's profile picture that captures their personality and role.

The AI details:
Name: {ai['name']}
Personality Type: {ai['personalityType']}
Specialization: {ai['specialization']}
Description: {ai['description']}
Capability Level: {ai['capabilityLevel']}

Requirements:
- Must be a professional portrait-style image
- Should reflect the AI's personality and specialization
- Use abstract or technological elements to represent an AI entity
- Maintain a consistent sci-fi aesthetic
- Should be visually striking but not overwhelming
- Use appropriate colors that match the AI's personality
- Must be suitable as a profile picture
- Include subtle technological or digital elements
- Must maintain professional quality
- Should be unique and memorable

Focus on creating a distinctive visual representation that captures the essence of this AI entity.
Be specific but concise. Do not include technical specifications or image size requirements."""

    try:
        completion = client.chat.completions.create(
            model="gpt-4o",
            messages=[
                {"role": "system", "content": "You are an expert at creating DALL-E image generation prompts."},
                {"role": "user", "content": prompt}
            ],
            temperature=0.7,
            max_tokens=150
        )
        
        dalle_prompt = completion.choices[0].message.content
        
        # Add technical specifications
        technical_specs = "The image should be a high-quality portrait format with professional lighting and composition, suitable for a profile picture. Maintain a clean, modern aesthetic with subtle technological elements."
        
        return f"{dalle_prompt} {technical_specs}"
        
    except Exception as e:
        print(f"Error generating GPT-4o prompt for {ai['name']}: {str(e)}")
        return generate_basic_dalle_prompt(ai)

def generate_basic_dalle_prompt(ai):
    """Fallback function for basic DALL-E prompt generation."""
    personality_styles = {
        'analytical': 'geometric and precise, with cool blue tones',
        'creative': 'flowing and dynamic, with vibrant colors',
        'strategic': 'structured and balanced, with deep purple accents',
        'supportive': 'warm and approachable, with soft green hues'
    }
    
    style = personality_styles.get(ai['personalityType'].lower(), 'balanced and professional')
    
    base_prompt = f"Create a professional AI profile picture for an entity named {ai['name']}. Style: {style}, specializing in {ai['specialization']}. The image should represent a {ai['capabilityLevel']} level AI with {ai['personalityType']} characteristics."
    technical_specs = "The image should be a high-quality portrait format with professional lighting and composition, suitable for a profile picture. Maintain a clean, modern aesthetic with subtle technological elements."
    
    return f"{base_prompt} {technical_specs}"

async def generate_profile_pic(client: OpenAI, ai, max_retries=3):
    """Generate profile picture using DALL-E."""
    prompt = await generate_dalle_prompt(ai, client)
    
    for attempt in range(max_retries):
        try:
            print(f"Generating profile picture for {ai['name']} (attempt {attempt + 1}/{max_retries})")
            
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

def save_profile_pic(image_data: bytes, ai_name: str):
    """Save the generated profile picture to disk."""
    filepath = PROFILE_PICS_DIR / get_profile_filename(ai_name)
    filepath.write_bytes(image_data)
    print(f"Saved profile picture to {filepath}")

def extract_mock_ais():
    """Extract AI data from mockAIs.ts file."""
    # This is a placeholder - you'll need to implement proper TS file parsing
    # For now, you might want to create a separate JSON file with AI data
    # or implement proper TypeScript parsing
    pass

async def main():
    try:
        if not os.getenv('OPENAI_API_KEY'):
            raise ValueError("OPENAI_API_KEY environment variable is not set")
        
        client = OpenAI()
        ensure_profile_directory()
        
        # For testing, you can use a sample AI
        sample_ai = {
            "name": "Vox",
            "personalityType": "analytical",
            "specialization": "research",
            "description": "A highly analytical AI focused on research and data analysis",
            "capabilityLevel": "advanced"
        }
        
        try:
            if not profile_exists(sample_ai['name']):
                image_data = await generate_profile_pic(client, sample_ai)
                save_profile_pic(image_data, sample_ai['name'])
            else:
                print(f"Profile picture already exists for {sample_ai['name']}, skipping...")
        except Exception as e:
            print(f"Failed to generate profile picture for {sample_ai['name']}: {str(e)}")
        
        print("Profile picture generation complete!")
        
    except Exception as e:
        print(f"An error occurred: {str(e)}")
        raise

if __name__ == "__main__":
    import asyncio
    asyncio.run(main())
