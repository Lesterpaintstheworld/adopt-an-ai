import yaml from 'js-yaml';

export const parseYaml = (data: any): string => {
  try {
    const options: yaml.DumpOptions = {
      indent: 2,
      lineWidth: 120,
      noRefs: true,
      sortKeys: true,
      noCompatMode: true,
      quotingType: '"' as const,
      forceQuotes: false,
    };

    if (typeof data === 'string') {
      return yaml.dump(yaml.load(data), options);
    }
    return yaml.dump(data, options);
  } catch (error) {
    console.error('Error parsing YAML:', error);
    return JSON.stringify(data, null, 2);
  }
};
