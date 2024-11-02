import os
import yaml
from pathlib import Path

def load_yaml(file_path):
    with open(file_path, 'r', encoding='utf-8') as f:
        try:
            return yaml.safe_load(f)
        except yaml.YAMLError as e:
            print(f"Error loading {file_path}: {e}")
            return None

def save_yaml(data, file_path):
    with open(file_path, 'w', encoding='utf-8') as f:
        yaml.dump(data, f, allow_unicode=True, sort_keys=False)

def update_capability_in_phase(phase_data, capability_id, capability_data):
    # List of layers to check
    layers = ['ecosystem_layer', 'application_layer', 'multi_agent_layer', 
              'agent_layer', 'model_layer', 'compute_layer']
    
    for layer_name in layers:
        if layer_name not in phase_data:
            continue
            
        layer = phase_data[layer_name]
        for item in layer:
            if item.get('capability_id') == capability_id:
                # Update the item with data from capability file
                item['name'] = capability_data['name']
                item['shortDescription'] = capability_data['description']['short']
                if 'long' in capability_data['description']:
                    item['longDescription'] = capability_data['description']['long']
                
                # Add prerequisites if they exist in capability data
                if 'dependencies' in capability_data and 'prerequisites' in capability_data['dependencies']:
                    prereqs = []
                    for layer_prereqs in capability_data['dependencies']['prerequisites'].values():
                        for prereq in layer_prereqs:
                            if isinstance(prereq, dict) and 'capability' in prereq:
                                prereqs.append(prereq['capability'])
                            elif isinstance(prereq, str):
                                prereqs.append(prereq)
                    if prereqs:
                        item['prerequisites'] = prereqs
                
                return True
    return False

def main():
    # Load tech tree
    tech_tree_path = Path('content/tech/tech-tree.yml')
    tech_tree = load_yaml(tech_tree_path)
    if not tech_tree:
        return
    
    # Get all capability files
    capabilities_dir = Path('content/tech')
    capability_files = list(capabilities_dir.glob('*.yml'))
    
    # Process each capability file
    for cap_file in capability_files:
        if cap_file.name == 'tech-tree.yml':
            continue
            
        capability_data = load_yaml(cap_file)
        if not capability_data or 'capability_id' not in capability_data:
            continue
            
        capability_id = capability_data['capability_id']
        
        # Find and update in appropriate phase
        found = False
        for phase_name, phase_data in tech_tree.items():
            if phase_name.startswith('phase_'):
                if update_capability_in_phase(phase_data, capability_id, capability_data):
                    found = True
                    break
        
        if not found:
            print(f"Warning: Capability {capability_id} not found in tech tree")
    
    # Save updated tech tree
    save_yaml(tech_tree, tech_tree_path)
    print("Tech tree updated successfully")

if __name__ == '__main__':
    main()
