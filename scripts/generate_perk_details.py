import os
import yaml
import asyncio
from anthropic import AsyncAnthropic
from pathlib import Path

def validate_perk_data(generated_data, original_data, template):
    """Validate generated perk data against original data and template"""
    inconsistencies = []
    
    # Verify required fields
    required_fields = [
        'capability_id',
        'name',
        'description',
        'technical_specifications',
        'dependencies'
    ]
    
    for field in required_fields:
        if field not in generated_data:
            inconsistencies.append(f"Missing required field: {field}")
    
    # Check consistency with original data
    if generated_data['capability_id'] != original_data['capability_id']:
        inconsistencies.append("Inconsistent capability_id")
    
    # Check dependencies consistency
    if 'prerequisites' in original_data:
        original_prereqs = set(original_data['prerequisites'])
        generated_prereqs = set()
        if 'dependencies' in generated_data and 'prerequisites' in generated_data['dependencies']:
            for layer in generated_data['dependencies']['prerequisites'].values():
                if isinstance(layer, list):
                    generated_prereqs.update(layer)
        
        missing_prereqs = original_prereqs - generated_prereqs
        if missing_prereqs:
            inconsistencies.append(f"Missing prerequisites: {missing_prereqs}")
    
    return inconsistencies

def fix_inconsistencies(generated_data, original_data, inconsistencies):
    """Try to fix detected inconsistencies"""
    fixed_data = generated_data.copy()
    
    for inconsistency in inconsistencies:
        if "Missing required field" in inconsistency:
            field = inconsistency.split(": ")[1]
            if field in original_data:
                fixed_data[field] = original_data[field]
        
        elif "Inconsistent capability_id" in inconsistency:
            fixed_data['capability_id'] = original_data['capability_id']
        
        elif "Missing prerequisites" in inconsistency:
            if 'dependencies' not in fixed_data:
                fixed_data['dependencies'] = {}
            if 'prerequisites' not in fixed_data['dependencies']:
                fixed_data['dependencies']['prerequisites'] = {}
            
            missing_prereqs = eval(inconsistency.split(": ")[1])
            fixed_data['dependencies']['prerequisites']['compute_layer'] = list(missing_prereqs)
    
    return fixed_data

class PerkGenerator:
    def __init__(self):
        self.model = "claude-3-sonnet-20240229"
        api_key = os.getenv("ANTHROPIC_API_KEY")
        if not api_key:
            raise ValueError("ANTHROPIC_API_KEY not found in environment!")
        self.client = AsyncAnthropic(api_key=api_key)

    async def _generate_raw_perk_details(self, perk_data, template):
        """Generate raw perk data using Claude"""
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

    async def generate_perk_details(self, perk_data, template, max_retries=3):
        """Generate detailed perk data using Claude with validation and fixes"""
        for attempt in range(max_retries):
            try:
                generated_data = await self._generate_raw_perk_details(perk_data, template)
                if not generated_data:
                    continue
                
                # Validate generated data
                inconsistencies = validate_perk_data(generated_data, perk_data, template)
                
                if not inconsistencies:
                    return generated_data
                
                print(f"Found inconsistencies (attempt {attempt + 1}): {inconsistencies}")
                
                # Try to fix inconsistencies
                fixed_data = fix_inconsistencies(generated_data, perk_data, inconsistencies)
                
                # Validate again after fixes
                remaining_inconsistencies = validate_perk_data(fixed_data, perk_data, template)
                
                if not remaining_inconsistencies:
                    print(f"Successfully fixed inconsistencies on attempt {attempt + 1}")
                    return fixed_data
                
                print(f"Unable to fix all inconsistencies, retrying... ({attempt + 1}/{max_retries})")
                
            except Exception as e:
                print(f"Error on attempt {attempt + 1}: {e}")
                if attempt == max_retries - 1:
                    raise
        
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
