import yaml
import os
from pathlib import Path
import re
import logging
import shutil

def setup_logging():
    logging.basicConfig(
        level=logging.INFO,
        format='%(asctime)s - %(levelname)s - %(message)s'
    )

def sanitize_filename(name):
    """Convertit un nom en format de fichier valide."""
    name = re.sub(r'[^a-zA-Z0-9\s-]', '', name)
    name = name.replace(' ', '-').lower()
    return name

def check_directories():
    """Vérifie que les répertoires nécessaires existent."""
    dirs = [
        Path('content/tech'),
        Path('public/website/ai-icons')
    ]
    for dir_path in dirs:
        if not dir_path.exists():
            raise FileNotFoundError(f"Directory not found: {dir_path}")

def process_tech_tree(dry_run=False):
    setup_logging()
    check_directories()
    
    # Chemins des répertoires
    tech_dir = Path('content/tech')
    icons_dir = Path('public/website/ai-icons')
    
    # Backup du tech-tree.yml
    shutil.copy2(tech_dir / 'tech-tree.yml', tech_dir / 'tech-tree.yml.backup')
    logging.info("Backup created: tech-tree.yml.backup")
    
    # Lecture du fichier tech-tree.yml
    with open(tech_dir / 'tech-tree.yml', 'r', encoding='utf-8') as f:
        tech_tree = yaml.safe_load(f)
    
    # Pour suivre les renommages
    renames = []
    
    # Parcours de toutes les phases et couches
    for phase_key, phase in tech_tree.items():
        if not isinstance(phase, dict):
            continue
            
        for layer_key, items in phase.items():
            if not isinstance(items, list):
                continue
                
            for item in items:
                if 'name' not in item or 'capability_id' not in item:
                    continue
                    
                # Création du nouveau nom de fichier
                sanitized_name = sanitize_filename(item['name'])
                new_base_name = f"{sanitized_name}-{item['capability_id']}"
                
                # Fichier icône
                old_icon = icons_dir / f"{sanitized_name}.png"
                new_icon = icons_dir / f"{new_base_name}.png"
                
                # Vérification et ajout des fichiers à renommer
                if old_icon.exists() and not new_icon.exists():
                    renames.append((old_icon, new_icon))
                    logging.info(f"Found icon to rename: {old_icon} -> {new_icon}")
                
                # Mise à jour de la référence dans le tech tree
                item['file_base_name'] = new_base_name
    
    if dry_run:
        logging.info("DRY RUN - Aucune modification effectuée")
        for old_path, new_path in renames:
            logging.info(f"Would rename: {old_path} -> {new_path}")
        return
    
    # Effectuer les renommages
    for old_path, new_path in renames:
        try:
            old_path.rename(new_path)
            logging.info(f"Renamed: {old_path} -> {new_path}")
        except Exception as e:
            logging.error(f"Error renaming {old_path}: {e}")
    
    # Sauvegarde du tech tree mis à jour
    with open(tech_dir / 'tech-tree.yml', 'w', encoding='utf-8') as f:
        yaml.dump(tech_tree, f, allow_unicode=True, sort_keys=False)
    
    logging.info("Update completed successfully")

if __name__ == "__main__":
    process_tech_tree(dry_run=False)
