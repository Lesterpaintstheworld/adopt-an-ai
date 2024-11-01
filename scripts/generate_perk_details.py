import os
import yaml
import asyncio
from anthropic import AsyncAnthropic
from pathlib import Path

class PerkGenerator:
    def __init__(self):
        self.model = "claude-3-sonnet-20240229"
        api_key = os.getenv("ANTHROPIC_API_KEY")
        if not api_key:
            raise ValueError("ANTHROPIC_API_KEY not found in environment!")
        self.client = AsyncAnthropic(api_key=api_key)
        
    async def generate_perk_details(self, perk_data, template):
        """Generate detailed perk data using Claude"""
        prompt = f"""You are a technical writer creating detailed specifications for AI capabilities.
        
        Here is the basic perk data:
        {yaml.dump(perk_data)}
        
        And here is the template to follow:
        {yaml.dump(template)}
        
        Please generate a detailed specification for this perk following the template structure.
        The specification should be in YAML format and include realistic technical details.
        Maintain consistency with the tech tree phase and layer.
        Use the same capability_id.
        
        Focus on:
        1. Technical specifications
        2. Dependencies and their visualization
        3. Risks and mitigations
        4. Integration testing
        5. Monitoring requirements
        
        Return only the YAML content, no other text."""

        try:
            response = await self.client.messages.create(
                model=self.model,
                messages=[{"role": "user", "content": prompt}],
                max_tokens=4000
            )
            return yaml.safe_load(response.content[0].text)
        except Exception as e:
            print(f"Error generating perk details: {e}")
            return None

async def main():
    # Load template
    template_path = Path("content/tech/COM_template.yml")
    with open(template_path) as f:
        template = yaml.safe_load(f)
    
    # Load tech tree
    tech_tree_path = Path("content/tech/tech-tree.yml")
    with open(tech_tree_path) as f:
        tech_tree = yaml.safe_load(f)
    
    generator = PerkGenerator()
    
    # Process each phase and layer
    for phase_key, phase_data in tech_tree.items():
        if isinstance(phase_data, dict):
            for layer_key, layer_items in phase_data.items():
                if isinstance(layer_items, list):
                    for item in layer_items:
                        if "capability_id" in item:
                            # Check if detailed file already exists
                            perk_file = Path(f"content/tech/{item['capability_id']}.yml")
                            if not perk_file.exists():
                                print(f"Generating details for {item['capability_id']}...")
                                
                                # Generate detailed perk data
                                detailed_perk = await generator.generate_perk_details(item, template)
                                
                                if detailed_perk:
                                    # Save to file
                                    with open(perk_file, 'w') as f:
                                        yaml.dump(detailed_perk, f, sort_keys=False, allow_unicode=True)
                                    print(f"Generated {perk_file}")
                                else:
                                    print(f"Failed to generate details for {item['capability_id']}")

if __name__ == "__main__":
    asyncio.run(main())
