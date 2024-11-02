import os
import yaml
import asyncio
import logging
import unicodedata
import codecs
from typing import Dict, List, Set
from datetime import datetime, timedelta
from anthropic import AsyncAnthropic
from pathlib import Path
from dotenv import load_dotenv

# Configure YAML for proper UTF-8 handling
yaml.add_representer(str, lambda dumper, data: dumper.represent_scalar('tag:yaml.org,2002:str', data, style='|' if '\n' in data else None))

# Constants
VALID_TAGS = {'🤝 SOCIAL', '⚙️ OPERATIONAL', '🎨 CREATIVE', '🧠 COGNITIVE', '🔧 TECHNICAL', '🌐 INTEGRATION'}
LAYER_SPECIFIC_RULES = {
    'compute_layer': {'required_metrics': ['utilization', 'performance']},
    'model_layer': {'required_metrics': ['accuracy', 'latency']},
    'agent_layer': {'required_metrics': ['reliability', 'response_time']},
    'application_layer': {'required_metrics': ['availability', 'error_rate']},
    'ecosystem_layer': {'required_metrics': ['adoption', 'engagement']},
    'multi_agent_layer': {'required_metrics': ['coordination', 'throughput']}
}

def setup_logging():
    """Configure logging"""
    logging.basicConfig(
        level=logging.INFO,
        format='%(asctime)s - %(levelname)s - %(message)s',
        handlers=[
            logging.FileHandler('perk_generation.log'),
            logging.StreamHandler()
        ]
    )

def validate_perk_data(generated_data: Dict, original_data: Dict, template: Dict) -> List[str]:
    """Enhanced validation of generated perk data"""
    inconsistencies = []
    
    # Template structure validation
    for key in template.keys():
        if key not in generated_data:
            inconsistencies.append(f"Missing template section: {key}")
    
    # Required fields validation
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
    
    # Tag validation
    if 'tag' in original_data and original_data['tag'] not in VALID_TAGS:
        inconsistencies.append(f"Invalid tag: {original_data['tag']}")
    
    # Prerequisites validation
    if 'prerequisites' in original_data:
        prereqs = set(original_data['prerequisites'])
        if not validate_prerequisites_exist(prereqs):
            inconsistencies.append("Invalid prerequisites referenced")
        
        # Check dependencies consistency
        generated_prereqs = set()
        if 'dependencies' in generated_data and 'prerequisites' in generated_data['dependencies']:
            for layer in generated_data['dependencies']['prerequisites'].values():
                if isinstance(layer, list):
                    generated_prereqs.update(layer)
        
        missing_prereqs = prereqs - generated_prereqs
        if missing_prereqs:
            inconsistencies.append(f"Missing prerequisites: {missing_prereqs}")
    
    # Chronological order validation
    if 'chronologicalOrder' in original_data:
        if not validate_chronological_order(original_data):
            inconsistencies.append("Invalid chronological order")
    
    return inconsistencies

def validate_prerequisites_exist(prereqs: Set[str]) -> bool:
    """Validate that all prerequisites exist in the tech tree"""
    with open(Path("content/tech/tech-tree.yml")) as f:
        tech_tree = yaml.safe_load(f)
    
    all_capabilities = set()
    for phase in tech_tree.values():
        if isinstance(phase, dict):
            for layer in phase.values():
                if isinstance(layer, list):
                    for item in layer:
                        if isinstance(item, dict) and 'name' in item:
                            all_capabilities.add(item['name'])
    
    return all(prereq in all_capabilities for prereq in prereqs)

def validate_chronological_order(data: Dict) -> bool:
    """Validate chronological order consistency"""
    if 'chronologicalOrder' not in data:
        return True
        
    phase, layer = extract_phase_and_layer(data.get('capability_id', ''))
    if not phase or not layer:
        return True
        
    with open(Path("content/tech/tech-tree.yml")) as f:
        tech_tree = yaml.safe_load(f)
    
    layer_items = tech_tree.get(phase, {}).get(layer, [])
    for item in layer_items:
        if isinstance(item, dict) and 'chronologicalOrder' in item:
            if item['chronologicalOrder'] < data['chronologicalOrder'] and \
               set(data.get('prerequisites', [])).intersection(set(item.get('prerequisites', []))):
                return False
    
    return True

def validate_technical_coherence(generated_data, phase, layer):
    """Validate technical coherence based on phase and layer context"""
    inconsistencies = []
    
    # Vérifier la cohérence avec la phase
    phase_number = int(phase[-1])  # Extrait le numéro de la phase (ex: phase_1 -> 1)
    
    # Vérifier la complexité technique en fonction de la phase
    tech_specs = generated_data.get('technical_specifications', {})
    performance_metrics = tech_specs.get('performance_metrics', {})
    
    if phase_number == 1 and 'quantum' in str(tech_specs).lower():
        inconsistencies.append("Phase 1 should not include quantum computing elements")
    
    # Vérifier la cohérence avec la couche
    if layer == 'compute_layer':
        if not any('compute' in str(metric).lower() for metric in performance_metrics):
            inconsistencies.append("Compute layer must include compute-related metrics")
    
    return inconsistencies

def validate_version_control(generated_data):
    """Validate version control information"""
    inconsistencies = []
    version_control = generated_data.get('version_control', {})
    
    # Vérifier le format de version
    if not version_control.get('current_version', '').count('.') == 2:
        inconsistencies.append("Version number should follow semantic versioning (X.Y.Z)")
    
    # Vérifier la cohérence des dates
    last_updated = version_control.get('last_updated')
    history = version_control.get('version_history', [])
    if history and last_updated:
        latest_history_date = history[-1].get('date')
        if latest_history_date != last_updated:
            inconsistencies.append("Last updated date doesn't match latest version history date")
    
    return inconsistencies

def validate_dependencies_graph(generated_data):
    """Validate the dependencies visualization graph"""
    inconsistencies = []
    
    if 'dependencies_visualization' not in generated_data:
        return ["Missing dependencies visualization"]
        
    viz = generated_data['dependencies_visualization']
    if 'primary_diagram' not in viz:
        return ["Missing primary diagram in dependencies visualization"]
        
    # Vérifier que tous les prérequis sont dans le graphe
    prereqs = set()
    if 'dependencies' in generated_data and 'prerequisites' in generated_data['dependencies']:
        for layer in generated_data['dependencies']['prerequisites'].values():
            if isinstance(layer, list):
                prereqs.update(layer)
    
    diagram = viz['primary_diagram']
    for prereq in prereqs:
        if prereq not in diagram:
            inconsistencies.append(f"Prerequisite {prereq} missing from visualization")
    
    return inconsistencies

def validate_metrics_coherence(generated_data):
    """Validate coherence between different metric sections"""
    inconsistencies = []
    
    # Vérifier la cohérence entre les KPIs et le monitoring
    kpis = set()
    if 'success_metrics' in generated_data:
        for metric_group in generated_data['success_metrics'].values():
            for metric in metric_group:
                if isinstance(metric, dict) and 'metric' in metric:
                    kpis.add(metric['metric'].lower())
    
    monitored_metrics = set()
    if 'monitoring_and_maintenance' in generated_data:
        monitoring = generated_data['monitoring_and_maintenance'].get('monitoring', {})
        metrics = monitoring.get('metrics_collection', [])
        if isinstance(metrics, list):
            monitored_metrics.update(m.lower() for m in metrics)
    
    for kpi in kpis:
        if not any(kpi in m for m in monitored_metrics):
            inconsistencies.append(f"KPI {kpi} not covered by monitoring")
    
    return inconsistencies

def generate_capability_id(phase_key: str, layer_key: str, order: int) -> str:
    """Generate a capability ID based on layer, phase and order"""
    # Map layers to prefixes - vérifier que tous les préfixes sont corrects
    layer_prefixes = {
        'compute_layer': 'COM',
        'model_layer': 'MOD',
        'agent_layer': 'AGT',
        'application_layer': 'APP',
        'ecosystem_layer': 'ECO',
        'multi_agent_layer': 'MLT'
    }
    
    # Extract phase number
    phase_num = f"P{phase_key.split('_')[1]}"
    
    # Get prefix for layer
    prefix = layer_prefixes.get(layer_key)
    if not prefix:
        print(f"Warning: Unknown layer key: {layer_key}")
        prefix = 'UNK'
    
    return f"{prefix}_{phase_num}_{order:03d}"

def extract_phase_and_layer(capability_id):
    """Extract phase and layer information from capability ID"""
    try:
        prefix, phase, number = capability_id.split('_')
        phase = f"phase_{phase[1]}"  # Convert P1 to phase_1
        
        # Map prefix to layer
        layer_mapping = {
            'COM': 'compute_layer',
            'MOD': 'model_layer',
            'AGT': 'agent_layer',
            'APP': 'application_layer',
            'ECO': 'ecosystem_layer',
            'MLT': 'multi_agent_layer'
        }
        layer = layer_mapping.get(prefix, 'unknown_layer')
        
        return phase, layer
    except:
        return None, None

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

def mask_api_key(key):
    """Show only the last 4 characters of the API key"""
    if not key:
        return "None"
    return f"...{key[-4:]}"

class PerkGenerator:
    def __init__(self):
        setup_logging()
        self.logger = logging.getLogger(__name__)
        self.model = "claude-3-sonnet-20240229"
        
        # Configuration globale de l'encodage pour YAML
        yaml.add_representer(
            str,
            lambda dumper, data: dumper.represent_scalar(
                'tag:yaml.org,2002:str',
                data,
                style='|' if '\n' in data else None
            )
        )
        
        # Search for .env file in current and parent directories
        current_dir = Path(__file__).parent.absolute()
        root_dir = current_dir
        env_path = None

        # Go up until we find .env or hit root
        while root_dir.parent != root_dir:
            possible_env = root_dir / ".env"
            if possible_env.exists():
                env_path = possible_env
                break
            root_dir = root_dir.parent

        if not env_path:
            raise FileNotFoundError("Could not find .env file in current or parent directories")

        print(f"Found .env file at: {env_path}")
        load_dotenv(dotenv_path=env_path)
        api_key = os.getenv("ANTHROPIC_API_KEY")
        
        print(f"Environment variables loaded: {list(os.environ.keys())}")
        print(f"ANTHROPIC_API_KEY present in environment: {'ANTHROPIC_API_KEY' in os.environ}")
        
        # Enhanced API key validation
        if not api_key:
            raise ValueError(f"ANTHROPIC_API_KEY not found in .env file at {env_path}!")
        
        if not api_key.startswith("sk-ant-"):
            raise ValueError("ANTHROPIC_API_KEY appears to be invalid - should start with 'sk-ant-'")
            
        if len(api_key) < 30:  # Typical Anthropic keys are longer
            raise ValueError("ANTHROPIC_API_KEY appears too short to be valid")
            
        print(f"Loaded API key ending in: {mask_api_key(api_key)}")
        self.client = AsyncAnthropic(api_key=api_key)
        self.generation_stats = {
            'attempts': 0,
            'successes': 0,
            'failures': 0,
            'fixes_required': 0,
            'dependency_fixes': 0,
            'metric_fixes': 0,
            'validation_time': 0
        }

    def sanitize_text(self, text):
        """Nettoie et normalise le texte en UTF-8"""
        if not isinstance(text, str):
            return text
        
        # Normalisation Unicode
        text = unicodedata.normalize('NFKC', text)
        
        # Nettoyage des caractères problématiques
        text = ''.join(c for c in text if c.isprintable() or c in ['\n', '\r', '\t'])
        
        return text

    async def _generate_raw_perk_details(self, perk_data: Dict, template: Dict) -> Dict:
        """Generate raw perk data using Claude"""
        try:
            # Lecture du fichier tech tree avec encodage explicite
            tech_tree_path = Path("content/tech/tech-tree.yml")
            with open(tech_tree_path, 'r', encoding='utf-8-sig') as f:
                tech_tree = yaml.safe_load(f)

            # Extract phase and layer for focused context
            phase, layer = extract_phase_and_layer(perk_data['capability_id'])
            print(f"Generating details for {perk_data['capability_id']} in {phase}, {layer}")
            
            phase_data = tech_tree.get(phase, {})
            layer_data = phase_data.get(layer, [])

            prompt = f"""You are a technical writer creating detailed specifications for AI capabilities.
            
            You are working on a comprehensive AI development tech tree. Here is the relevant context:
            
            Phase: {phase}
            Phase Description: {phase_data.get('description', 'N/A')}
            Phase Period: {phase_data.get('period', 'N/A')}
            
            Current Layer: {layer}
            Layer Capabilities: {yaml.dump(layer_data)}
            
            Here is the specific capability to detail:
            {yaml.dump(perk_data)}
            
            Please follow this template structure:
            {yaml.dump(template)}
            
            Generate a detailed specification for this capability following the template.
            The specification should:
            1. Be in YAML format
            2. Include realistic technical details
            3. Maintain consistency with the tech tree phase and layer
            4. Use the same capability_id
            5. Consider dependencies within the same phase and earlier phases
            
            Focus on:
            1. Technical specifications
            2. Dependencies and their visualization
            3. Risks and mitigations
            4. Integration testing
            5. Monitoring requirements
            
            Return only the YAML content, no other text."""

            print("Sending request to Claude API...")
            response = await self.client.messages.create(
                model=self.model,
                messages=[{"role": "user", "content": prompt}],
                max_tokens=4000
            )
            print("Received response from Claude API")

            if not response.content:
                print("Error: Empty response from API")
                return None

            if not response.content:
                print("Error: Empty response from API")
                return None

            raw_text = response.content[0].text
            # Nettoyage et normalisation du texte
            raw_text = self.sanitize_text(raw_text)
            
            # Nettoyage du formatage markdown
            raw_text = raw_text.strip('`yaml\n`')
            
            try:
                # Parse YAML avec gestion explicite de l'encodage
                result = yaml.safe_load(raw_text)
                
                if result:
                    # Nettoyer récursivement toutes les chaînes dans le résultat
                    def clean_dict(d):
                        if isinstance(d, dict):
                            return {k: clean_dict(v) for k, v in d.items()}
                        elif isinstance(d, list):
                            return [clean_dict(x) for x in d]
                        elif isinstance(d, str):
                            return self.sanitize_text(d)
                        return d
                    
                    return clean_dict(result)
                return None
                
            except yaml.YAMLError as e:
                print("Error parsing YAML response:", e)
                print("Raw response:", raw_text)
                return None
            except Exception as e:
                print(f"Error processing response: {str(e)}")
                print("Raw response:", raw_text)
                return None

        except Exception as e:
            print(f"Error in _generate_raw_perk_details: {str(e)}")
            print(f"Error type: {type(e)}")
            import traceback
            print("Traceback:", traceback.format_exc())
            return None

    async def generate_perk_details(self, perk_data: Dict, template: Dict, max_retries: int = 3) -> Dict:
        """Enhanced perk generation with better error handling and logging"""
        self.logger.info(f"Generating details for {perk_data.get('capability_id', 'unknown')}")
        start_time = datetime.now()
        
        self.generation_stats['attempts'] += 1
        
        phase, layer = extract_phase_and_layer(perk_data['capability_id'])
        
        for attempt in range(max_retries):
            try:
                print(f"Attempt {attempt + 1}/{max_retries} for {perk_data['capability_id']}")
                generated_data = await self._generate_raw_perk_details(perk_data, template)
                if not generated_data:
                    print(f"No data generated on attempt {attempt + 1}")
                    continue
                
                # Validation
                inconsistencies = []
                inconsistencies.extend(validate_perk_data(generated_data, perk_data, template))
                inconsistencies.extend(validate_technical_coherence(generated_data, phase, layer))
                inconsistencies.extend(validate_version_control(generated_data))
                
                if not inconsistencies:
                    self.generation_stats['successes'] += 1
                    return generated_data
                
                print(f"Found {len(inconsistencies)} inconsistencies on attempt {attempt + 1}")
                for i in inconsistencies:
                    print(f"- {i}")
                
                # Try to fix inconsistencies
                fixed_data = fix_inconsistencies(generated_data, perk_data, inconsistencies)
                if fixed_data:
                    print("Successfully fixed inconsistencies")
                    self.generation_stats['successes'] += 1
                    return fixed_data
                
            except Exception as e:
                print(f"Error on attempt {attempt + 1}: {e}")
                if attempt == max_retries - 1:
                    self.generation_stats['failures'] += 1
                    raise
        
        self.generation_stats['failures'] += 1
        return None

    async def test_api_connection(self):
        """Test the API connection before starting generation"""
        try:
            response = await self.client.messages.create(
                model=self.model,
                messages=[{"role": "user", "content": "Test connection"}],
                max_tokens=10
            )
            return True
        except Exception as e:
            self.logger.error(f"API connection test failed: {str(e)}")
            return False

    def print_generation_stats(self):
        """Print enhanced generation statistics"""
        print("\nDetailed Generation Statistics:")
        print(f"Total attempts: {self.generation_stats['attempts']}")
        print(f"Successful generations: {self.generation_stats['successes']}")
        print(f"Failed generations: {self.generation_stats['failures']}")
        print(f"Fixes required: {self.generation_stats['fixes_required']}")
        print(f"Dependency fixes: {self.generation_stats['dependency_fixes']}")
        print(f"Metric fixes: {self.generation_stats['metric_fixes']}")
        print(f"Average validation time: {self.generation_stats['validation_time']/max(1, self.generation_stats['attempts']):.2f}s")
        if self.generation_stats['attempts'] > 0:
            success_rate = (self.generation_stats['successes'] / self.generation_stats['attempts']) * 100
            print(f"Success rate: {success_rate:.2f}%")

def save_generation_stats(stats, output_file="generation_stats.yml"):
    """Save generation statistics to a YAML file"""
    with open(output_file, 'w', encoding='utf-8') as f:
        yaml.dump(stats, f, allow_unicode=True)

async def main():
    generator = PerkGenerator()
    
    # Test API connection first
    print("Testing API connection...")
    if not await generator.test_api_connection():
        print("Failed to connect to Anthropic API. Please check your API key.")
        return
        
    print("API connection successful!")
    
    # Load template
    template_path = Path("content/tech/COM_template.yml")
    with open(template_path, encoding='utf-8') as f:
        template = yaml.safe_load(f)
    
    # Load tech tree
    tech_tree_path = Path("content/tech/tech-tree.yml")
    with codecs.open(tech_tree_path, 'r', encoding='utf-8', errors='replace') as f:
        tech_tree = yaml.safe_load(f)

    print("\nExisting capability files:")
    tech_dir = Path("content/tech")
    existing_files = [f.stem for f in tech_dir.glob("*.yml") if f.stem not in ['tech-tree', 'COM_template']]
    print(f"Found {len(existing_files)} capability files: {existing_files}")
    
    print("\nScanning tech tree and assigning capability IDs:")
    capabilities_to_update = []
    capabilities_found = []
    
    capabilities_found = []
    
    # First pass: collect all capabilities needing IDs
    for phase_key, phase_data in tech_tree.items():
        if isinstance(phase_data, dict):
            print(f"\nChecking {phase_key}:")
            for layer_key, layer_items in phase_data.items():
                if isinstance(layer_items, list):
                    print(f"  Layer: {layer_key}")
                    order = 1
                    for item in layer_items:
                        if isinstance(item, dict) and 'name' in item:
                            if 'capability_id' not in item:
                                new_id = generate_capability_id(phase_key, layer_key, order)
                                print(f"    Adding ID {new_id} to: {item['name']}")
                                item['capability_id'] = new_id
                                capabilities_to_update.append(item)
                            else:
                                print(f"    Existing ID {item['capability_id']}: {item['name']}")
                            capabilities_found.append(item['capability_id'])
                            order += 1
    
    print("\nSummary:")
    print(f"Total capabilities in tech tree: {len(capabilities_found)}")
    print(f"Capabilities found: {capabilities_found}")
    print(f"Missing files: {set(capabilities_found) - set(existing_files)}")
    
    # Save updated tech tree
    if capabilities_to_update:
        print(f"\nUpdating {len(capabilities_to_update)} capabilities in tech-tree.yml")
        with open(tech_tree_path, 'w', encoding='utf-8') as f:
            yaml.dump(tech_tree, f, sort_keys=False, allow_unicode=True)
    
    generator = PerkGenerator()
    
    # Ajouter un compteur pour suivre la progression
    total_capabilities = len(capabilities_found)
    processed = 0
    failed = []
    
    try:
        # Process each capability
        for phase_key, phase_data in tech_tree.items():
            if isinstance(phase_data, dict):
                for layer_key, layer_items in phase_data.items():
                    if isinstance(layer_items, list):
                        for item in layer_items:
                            if 'capability_id' in item:
                                processed += 1
                                perk_file = Path(f"content/tech/{item['capability_id']}.yml")
                                print(f"\nProcessing {processed}/{total_capabilities}: {item['capability_id']}")
                                print(f"Name: {item.get('name', 'N/A')}")
                                print(f"Layer: {layer_key}")
                                print(f"File exists: {perk_file.exists()}")
                                
                                if not perk_file.exists():
                                    try:
                                        print(f"Generating capability {item['capability_id']}...")
                                        detailed_perk = await generator.generate_perk_details(item, template)
                                        
                                        if detailed_perk:
                                            # Clean data before writing
                                            cleaned_perk = {}
                                            for key, value in detailed_perk.items():
                                                if isinstance(value, str):
                                                    cleaned_perk[key] = generator.sanitize_text(value)
                                                elif isinstance(value, dict):
                                                    cleaned_perk[key] = {k: generator.sanitize_text(v) if isinstance(v, str) else v 
                                                                       for k, v in value.items()}
                                                elif isinstance(value, list):
                                                    cleaned_perk[key] = [generator.sanitize_text(item) if isinstance(item, str) else item 
                                                                       for item in value]
                                                else:
                                                    cleaned_perk[key] = value
                                                    
                                            with open(perk_file, 'w', encoding='utf-8') as f:
                                                f.write('# -*- coding: utf-8 -*-\n')
                                                yaml.dump(cleaned_perk, f, sort_keys=False, allow_unicode=True,
                                                        default_flow_style=False, width=float("inf"))
                                            print(f"Successfully generated {perk_file}")
                                        else:
                                            print(f"Failed to generate details for {item['capability_id']}")
                                            failed.append(item['capability_id'])
                                    except Exception as e:
                                        print(f"Error generating {item['capability_id']}: {str(e)}")
                                        failed.append(item['capability_id'])
                                        continue
        
        print("\nSummary:")
        print(f"Total capabilities in tech tree: {len(capabilities_found)}")
        print(f"Capabilities found: {capabilities_found}")
        print(f"Missing files: {set(capabilities_found) - set(existing_files)}")
    finally:
        generator.print_generation_stats()
        save_generation_stats(generator.generation_stats)
        
        # Afficher un résumé des erreurs les plus communes
        print("\nCommon Error Patterns:")
        error_patterns = {}
        for phase_key, phase_data in tech_tree.items():
            if isinstance(phase_data, dict):
                for layer_key, layer_items in phase_data.items():
                    if isinstance(layer_items, list):
                        for item in layer_items:
                            if "capability_id" in item:
                                perk_file = Path(f"content/tech/{item['capability_id']}.yml")
                                if not perk_file.exists():
                                    error_patterns[item['capability_id']] = "Generation failed"
        
        for pattern, count in error_patterns.items():
            print(f"{pattern}: {count}")

if __name__ == "__main__":
    asyncio.run(main())
