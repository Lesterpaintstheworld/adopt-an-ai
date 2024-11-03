#!/usr/bin/env python3
"""
Script to improve capability descriptions by ensuring they follow a consistent format
and contain all required fields.
"""

import os
import yaml
import json
import asyncio
import logging
import traceback
from pathlib import Path
import shutil
from anthropic import AsyncAnthropic
from dotenv import load_dotenv
from collections import defaultdict
from datetime import datetime, timedelta

class ImprovementStats:
    def __init__(self):
        self.processed = 0
        self.successful = 0
        self.failed = 0
        self.validation_issues = 0
        self.sections_improved = defaultdict(int)
        self.common_issues = defaultdict(int)
        self.processing_time = timedelta()
        
    def add_file_stats(self, file_path, success, issues, sections, duration):
        self.processed += 1
        if success:
            self.successful += 1
        else:
            self.failed += 1
        self.validation_issues += len(issues)
        for section in sections:
            self.sections_improved[section] += 1
        for issue in issues:
            self.common_issues[issue] += 1
        self.processing_time += duration
        
    def print_summary(self):
        print("\nStatistiques d'amélioration:")
        print(f"Fichiers traités: {self.processed}")
        print(f"Réussis: {self.successful}")
        print(f"Échoués: {self.failed}")
        print(f"Problèmes de validation: {self.validation_issues}")
        print("\nSections améliorées:")
        for section, count in self.sections_improved.items():
            print(f"- {section}: {count}")
        print("\nProblèmes fréquents:")
        for issue, count in self.common_issues.items():
            print(f"- {issue}: {count}")
        print(f"\nTemps total: {self.processing_time}")

def setup_logging(args):
    """Configure le système de logging"""
    log_format = '%(asctime)s - %(levelname)s - %(message)s'
    if args.debug:
        level = logging.DEBUG
    else:
        level = logging.INFO
        
    # Logger vers fichier et console
    logging.basicConfig(
        level=level,
        format=log_format,
        handlers=[
            logging.FileHandler('improve_capabilities.log'),
            logging.StreamHandler()
        ]
    )

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
    parser.add_argument("--force", action="store_true",
                       help="Force changes even with validation issues")
    parser.add_argument("--skip-sections", type=str, nargs="+",
                       help="Sections to skip modifying")
    parser.add_argument("--focus-sections", type=str, nargs="+",
                       help="Only focus on these sections")
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

def validate_improvements(original: dict, improved: dict) -> list:
    """Validate that improvements are coherent"""
    issues = []
    
    # Check critical sections still exist
    critical_sections = ['technical_specifications', 'operational_states', 
                        'risks_and_mitigations', 'security_requirements']
    for section in critical_sections:
        if section in original and section not in improved:
            issues.append(f"Section {section} missing in improved version")
            
    # Check dependencies consistency
    if 'dependencies' in original and 'dependencies' in improved:
        orig_deps = set(str(d) for d in original['dependencies'].get('prerequisites', []))
        new_deps = set(str(d) for d in improved['dependencies'].get('prerequisites', []))
        if not orig_deps.issubset(new_deps):
            issues.append("Original dependencies were removed")
            
    # Check essential metrics and constraints are preserved
    if 'technical_specifications' in original:
        orig_metrics = set()
        new_metrics = set()
        orig_constraints = set()
        new_constraints = set()
        
        orig_perf_metrics = original['technical_specifications'].get('performance_metrics', {})
        new_perf_metrics = improved['technical_specifications'].get('performance_metrics', {})
        
        # Collect metrics
        for category, metrics in orig_perf_metrics.items():
            if category != 'constraints':  # Skip constraints when collecting metrics
                if isinstance(metrics, dict):
                    orig_metrics.update(str(k) for k in metrics.keys())
                elif isinstance(metrics, list):
                    orig_metrics.update(str(m) for m in metrics)
                    
        for category, metrics in new_perf_metrics.items():
            if category != 'constraints':  # Skip constraints when collecting metrics
                if isinstance(metrics, dict):
                    new_metrics.update(str(k) for k in metrics.keys())
                elif isinstance(metrics, list):
                    new_metrics.update(str(m) for m in metrics)
        
        # Collect constraints separately
        if 'constraints' in orig_perf_metrics:
            orig_constraints.update(str(c) for c in orig_perf_metrics['constraints'])
        if 'constraints' in new_perf_metrics:
            new_constraints.update(str(c) for c in new_perf_metrics['constraints'])
        
        # Check metrics
        if not orig_metrics.issubset(new_metrics):
            missing_metrics = orig_metrics - new_metrics
            issues.append(f"Essential metrics were removed: {missing_metrics}")
            
        # Check constraints
        if not orig_constraints.issubset(new_constraints):
            missing_constraints = orig_constraints - new_constraints
            issues.append(f"Essential constraints were removed: {missing_constraints}")
            
    return issues


async def improve_capability_file(client, file_path: Path, args):
    """Améliore un fichier de capacité"""
    try:
        data = load_yaml(file_path)
        if not data:
            logging.error(f"Failed to load YAML from {file_path}")
            return False
            
        start_time = datetime.now()
        
        # Extraire et logger les métriques existantes
        existing_metrics = {}
        if 'technical_specifications' in data:
            if 'performance_metrics' in data['technical_specifications']:
                existing_metrics = data['technical_specifications']['performance_metrics']
                logging.info(f"Existing metrics found: {json.dumps(existing_metrics, indent=2)}")
            else:
                logging.info("No existing performance metrics found in technical_specifications")
        else:
            logging.info("No technical_specifications section found")

        prompt = f"""You are improving the technical specifications for an AI capability.
        Please enhance these sections of the YAML file to be more detailed and precise:
        - technical_specifications (IMPORTANT: preserve the exact structure and values of existing performance_metrics)
        - operational_states
        - risks_and_mitigations
        - integration_testing
        - monitoring_and_maintenance
        - security_requirements

        IMPORTANT: You must keep the exact same structure and values for performance_metrics:
        {yaml.dump({'technical_specifications': {'performance_metrics': existing_metrics}}, allow_unicode=True)}

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
            logging.error("Empty response from Claude")
            return False

        response_text = response.content[0].text.strip()
        if response_text.startswith('```yaml'):
            response_text = response_text[7:]
        if response_text.startswith('```'):
            response_text = response_text[3:]
        if response_text.endswith('```'):
            response_text = response_text[:-3]
        response_text = response_text.strip()

        try:
            improved = yaml.safe_load(response_text)
            if not improved:
                logging.error("Failed to parse Claude's response as YAML")
                return False
                
            logging.info("Successfully parsed Claude's response")
            
            # Ensure performance_metrics are preserved exactly as they were
            if 'technical_specifications' in improved:
                improved['technical_specifications']['performance_metrics'] = existing_metrics
            
            # Validate improvements
            issues = validate_improvements(data, improved)
            if issues:
                logging.warning(f"Validation issues detected for {file_path}:")
                for issue in issues:
                    logging.warning(f"- {issue}")
                if not args.force:
                    return False
            
            sections_improved = []
            for section in ['technical_specifications', 'operational_states', 
                           'risks_and_mitigations', 'integration_testing',
                           'monitoring_and_maintenance', 'security_requirements']:
                if section in improved:
                    if args.skip_sections and section in args.skip_sections:
                        continue
                    if args.focus_sections and section not in args.focus_sections:
                        continue
                    data[section] = improved[section]
                    sections_improved.append(section)
                    
            if not args.dry_run:
                save_yaml(file_path, data)
                logging.info(f"Saved improvements to {file_path}")
            else:
                logging.info("Dry run - no changes saved")
                
            duration = datetime.now() - start_time
            return True, sections_improved, issues, duration
            
        except Exception as e:
            logging.error(f"Error processing {file_path}: {e}")
            logging.error(f"Exception type: {type(e)}")
            logging.error(f"Exception traceback: {traceback.format_exc()}")
            return False, [], [str(e)], datetime.now() - start_time
            
    except Exception as e:
        logging.error(f"Error processing {file_path}: {str(e)}")
        logging.error(f"Exception type: {type(e)}")
        logging.error(f"Exception traceback: {traceback.format_exc()}")
        return False, [], [str(e)], timedelta()

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
