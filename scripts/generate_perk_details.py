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

class PerkGenerator:
    def __init__(self):
        self.model = "claude-3-sonnet-20240229"
        api_key = os.getenv("ANTHROPIC_API_KEY")
        if not api_key:
            raise ValueError("ANTHROPIC_API_KEY not found in environment!")
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
        """Generate detailed perk data using Claude with enhanced validation"""
        import time
        start_time = time.time()
        
        self.generation_stats['attempts'] += 1
        
        phase, layer = extract_phase_and_layer(perk_data['capability_id'])
        
        for attempt in range(max_retries):
            try:
                generated_data = await self._generate_raw_perk_details(perk_data, template)
                if not generated_data:
                    continue
                
                # Validation complète
                inconsistencies = []
                inconsistencies.extend(validate_perk_data(generated_data, perk_data, template))
                inconsistencies.extend(validate_technical_coherence(generated_data, phase, layer))
                inconsistencies.extend(validate_version_control(generated_data))
                inconsistencies.extend(validate_dependencies_graph(generated_data))
                inconsistencies.extend(validate_metrics_coherence(generated_data))
                
                # Mise à jour des statistiques
                if any('dependencies' in i for i in inconsistencies):
                    self.generation_stats['dependency_fixes'] += 1
                if any('metric' in i.lower() for i in inconsistencies):
                    self.generation_stats['metric_fixes'] += 1
                    
                self.generation_stats['validation_time'] += time.time() - start_time
                
                if not inconsistencies:
                    self.generation_stats['successes'] += 1
                    return generated_data
                
                print(f"Found inconsistencies (attempt {attempt + 1}): {inconsistencies}")
                
                # Correction avec statistiques
                self.generation_stats['fixes_required'] += 1
                fixed_data = fix_inconsistencies(generated_data, perk_data, inconsistencies)
                
                # Revalidation après correction
                remaining_inconsistencies = []
                remaining_inconsistencies.extend(validate_perk_data(fixed_data, perk_data, template))
                remaining_inconsistencies.extend(validate_technical_coherence(fixed_data, phase, layer))
                remaining_inconsistencies.extend(validate_version_control(fixed_data))
                
                if not remaining_inconsistencies:
                    print(f"Successfully fixed inconsistencies on attempt {attempt + 1}")
                    self.generation_stats['successes'] += 1
                    return fixed_data
                
                print(f"Unable to fix all inconsistencies, retrying... ({attempt + 1}/{max_retries})")
                
            except Exception as e:
                print(f"Error on attempt {attempt + 1}: {e}")
                if attempt == max_retries - 1:
                    self.generation_stats['failures'] += 1
                    raise
        
        self.generation_stats['failures'] += 1
        return None

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
    with open(output_file, 'w') as f:
        yaml.dump(stats, f)

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
    
    try:
        # Process each phase and layer
        for phase_key, phase_data in tech_tree.items():
            if isinstance(phase_data, dict):
                for layer_key, layer_items in phase_data.items():
                    if isinstance(layer_items, list):
                        for item in layer_items:
                            if "capability_id" in item:
                                perk_file = Path(f"content/tech/{item['capability_id']}.yml")
                                if not perk_file.exists():
                                    print(f"Generating details for {item['capability_id']}...")
                                    
                                    detailed_perk = await generator.generate_perk_details(item, template)
                                    
                                    if detailed_perk:
                                        with open(perk_file, 'w') as f:
                                            yaml.dump(detailed_perk, f, sort_keys=False, allow_unicode=True)
                                        print(f"Generated {perk_file}")
                                    else:
                                        print(f"Failed to generate details for {item['capability_id']}")
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
