import yaml from 'js-yaml';

export const parseYaml = (data: any): string => {
  try {
    if (typeof data === 'string') {
      // Si c'est déjà une chaîne YAML, on la parse
      return yaml.dump(yaml.load(data), {
        indent: 2,
        lineWidth: -1,
        noRefs: true,
        sortKeys: true
      });
    }
    // Sinon on convertit l'objet en YAML
    return yaml.dump(data, {
      indent: 2,
      lineWidth: -1,
      noRefs: true,
      sortKeys: true
    });
  } catch (error) {
    console.error('Error parsing YAML:', error);
    return JSON.stringify(data, null, 2);
  }
};
