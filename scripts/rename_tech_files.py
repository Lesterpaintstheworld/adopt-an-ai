import yaml
import os
from pathlib import Path
import re

def sanitize_filename(name):
    """Convertit un nom en format de fichier valide."""
    # Remplace les espaces par des tirets et supprime les caractères spéciaux
    name = re.sub(r'[^a-zA-Z0-9\s-]', '', name)
    name = name.replace(' ', '-').lower()
    return name

def process_tech_tree():
    # Chemins des répertoires
    tech_dir = Path('content/tech')
    images_dir = Path('public/website/ai-icons')
    
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
                
                # Fichier YAML
                old_yaml = tech_dir / f"{item['capability_id']}.yml"
                new_yaml = tech_dir / f"{new_base_name}.yml"
                
                # Fichier image
                old_image = images_dir / f"{sanitize_filename(item['name'])}.png"
                new_image = images_dir / f"{new_base_name}.png"
                
                # Enregistrement des renommages à effectuer
                if old_yaml.exists():
                    renames.append((old_yaml, new_yaml))
                if old_image.exists():
                    renames.append((old_image, new_image))
                
                # Mise à jour de la référence dans le tech tree
                item['file_base_name'] = new_base_name
    
    # Effectuer les renommages
    for old_path, new_path in renames:
        try:
            old_path.rename(new_path)
            print(f"Renommé: {old_path} -> {new_path}")
        except Exception as e:
            print(f"Erreur lors du renommage de {old_path}: {e}")
    
    # Sauvegarde du tech tree mis à jour
    with open(tech_dir / 'tech-tree.yml', 'w', encoding='utf-8') as f:
        yaml.dump(tech_tree, f, allow_unicode=True, sort_keys=False)
    
    print("Mise à jour terminée")

if __name__ == "__main__":
    process_tech_tree()
