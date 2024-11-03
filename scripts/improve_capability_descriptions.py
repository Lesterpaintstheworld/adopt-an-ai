#!/usr/bin/env python3
"""
Script to improve capability descriptions by ensuring they follow a consistent format
and contain all required fields.
"""

import os
import sys
import yaml
from pathlib import Path

def load_yaml(file_path):
    """Load YAML file and return contents"""
    with open(file_path, 'r', encoding='utf-8') as f:
        try:
            return yaml.safe_load(f)
        except yaml.YAMLError as e:
            print(f"Error parsing {file_path}: {e}")
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

def main():
    """Main entry point"""
    content_dir = Path('content')
    tech_dir = content_dir / 'tech'

    # Process individual capability files
    for yml_file in tech_dir.glob('*.yml'):
        if yml_file.name.startswith('APP_'):
            data = load_yaml(yml_file)
            if data:
                improve_capability(data)
                save_yaml(yml_file, data)

    # Process tech tree
    tech_tree_path = tech_dir / 'tech-tree.yml'
    if tech_tree_path.exists():
        data = load_yaml(tech_tree_path)
        if data:
            for phase_name, phase in data.items():
                if isinstance(phase, dict):
                    process_phase(phase)
            save_yaml(tech_tree_path, data)

if __name__ == '__main__':
    main()
