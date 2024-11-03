#!/usr/bin/env python3
"""
Script to improve capability descriptions by ensuring they follow a consistent format
and contain all required fields.
"""

import os
import yaml
import asyncio
import logging
from pathlib import Path
from anthropic import AsyncAnthropic
from dotenv import load_dotenv

def setup_api():
    """Setup and validate Anthropic API access"""
    current_dir = Path(__file__).parent.absolute()
    root_dir = current_dir
    env_path = None

    while root_dir.parent != root_dir:
        possible_env = root_dir / ".env"
        if possible_env.exists():
            env_path = possible_env
            break
        root_dir = root_dir.parent

    if not env_path:
        raise FileNotFoundError("Could not find .env file")

    load_dotenv(dotenv_path=env_path)
    api_key = os.getenv("ANTHROPIC_API_KEY")
    
    if not api_key:
        raise ValueError(f"ANTHROPIC_API_KEY not found in .env file at {env_path}!")
    
    if not api_key.startswith("sk-ant-"):
        raise ValueError("ANTHROPIC_API_KEY appears to be invalid")
            
    if len(api_key) < 30:
        raise ValueError("ANTHROPIC_API_KEY appears too short to be valid")
            
    return AsyncAnthropic(api_key=api_key)

def parse_args():
    """Parse command line arguments"""
    import argparse
    parser = argparse.ArgumentParser()
    parser.add_argument("--tech-dir", type=str, default="content/tech",
                       help="Directory containing tech YAML files")
    parser.add_argument("--tech-tree", type=str, default="content/tech/tech-tree.yml",
                       help="Path to tech-tree.yml file")
    parser.add_argument("--model", type=str, default="claude-3-sonnet-20240229",
                       help="Claude model to use")
    parser.add_argument("--temperature", type=float, default=0.7,
                       help="Temperature for generation")
    parser.add_argument("--max-tokens", type=int, default=4000,
                       help="Maximum tokens for generation")
    parser.add_argument("--single-file", type=str,
                       help="Process only this specific YAML file")
    parser.add_argument("--debug", action="store_true",
                       help="Enable debug logging")
    parser.add_argument("--dry-run", action="store_true",
                       help="Don't save changes, just show what would be done")
    return parser.parse_args()

def load_yaml(file_path):
    """Load YAML file and return contents"""
    with open(file_path, 'r', encoding='utf-8') as f:
        try:
            return yaml.safe_load(f)
        except yaml.YAMLError as e:
            logging.error(f"Error parsing {file_path}: {e}")
            return None

def save_yaml(file_path, data):
    """Save data to YAML file"""
    with open(file_path, 'w', encoding='utf-8') as f:
        yaml.dump(data, f, sort_keys=False, allow_unicode=True)

def improve_capability(capability):
    """
    Improve a capability's description fields by:
    1. Ensuring both short and long descriptions exist
    2. Making descriptions more detailed and consistent
    3. Adding any missing required fields
    """
    if not capability.get('shortDescription'):
        if capability.get('description'):
            capability['shortDescription'] = capability['description']
        else:
            capability['shortDescription'] = capability.get('name', '')

    if not capability.get('longDescription'):
        capability['longDescription'] = capability.get('shortDescription', '')

    # Remove old description field if it exists
    if 'description' in capability:
        del capability['description']

    return capability

def process_phase(phase_data):
    """Process all capabilities in a phase"""
    for layer_name, layer in phase_data.items():
        if isinstance(layer, list):
            for capability in layer:
                improve_capability(capability)

async def improve_capability_file(client, file_path: Path, args):
    """Improve a single capability file's descriptions"""
    data = load_yaml(file_path)
    if not data:
        return False
        
    # Generate improved descriptions using Claude
    prompt = f"""You are improving the technical specifications for an AI capability.
    Please enhance these sections of the YAML file to be more detailed and precise:
    - technical_specifications
    - operational_states
    - risks_and_mitigations
    - integration_testing
    - monitoring_and_maintenance
    - security_requirements

    Current content:
    {yaml.dump(data, allow_unicode=True)}

    Provide only the improved YAML content for those sections, maintaining the same structure.
    Do not modify other sections."""

    response = await client.messages.create(
        model=args.model,
        messages=[{"role": "user", "content": prompt}],
        max_tokens=args.max_tokens,
        temperature=args.temperature
    )

    if not response.content:
        return False

    # Parse response and update sections
    try:
        improved = yaml.safe_load(response.content[0].text)
        for section in ['technical_specifications', 'operational_states', 
                       'risks_and_mitigations', 'integration_testing',
                       'monitoring_and_maintenance', 'security_requirements']:
            if section in improved:
                data[section] = improved[section]
                
        if not args.dry_run:
            save_yaml(file_path, data)
        return True
    except Exception as e:
        logging.error(f"Error processing {file_path}: {e}")
        return False

async def main():
    """Main entry point"""
    args = parse_args()
    
    if args.debug:
        logging.basicConfig(level=logging.DEBUG)
    else:
        logging.basicConfig(level=logging.INFO)

    client = setup_api()
    
    if args.single_file:
        file_path = Path(args.single_file)
        if not file_path.exists():
            print(f"File not found: {args.single_file}")
            return
        success = await improve_capability_file(client, file_path, args)
        print(f"Processed {file_path}: {'Success' if success else 'Failed'}")
        return

    tech_dir = Path(args.tech_dir)
    processed = 0
    successful = 0
    
    for yml_file in tech_dir.glob("*.yml"):
        if yml_file.name == "tech-tree.yml":
            continue
            
        print(f"Processing {yml_file.name}...")
        if await improve_capability_file(client, yml_file, args):
            successful += 1
        processed += 1
        
    print(f"\nProcessed {processed} files, {successful} successful")

if __name__ == '__main__':
    asyncio.run(main())
