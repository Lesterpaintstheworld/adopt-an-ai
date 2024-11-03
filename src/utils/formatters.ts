export const formatValue = (value: any): string => {
  try {
    // Base cases
    if (value === null || value === undefined) {
      return '';
    }

    // Primitive types
    if (typeof value === 'string') return value;
    if (typeof value === 'number') return value.toString();
    if (typeof value === 'boolean') return value.toString();

    // Dates
    if (value instanceof Date) {
      return value.toLocaleDateString();
    }

    // Arrays
    if (Array.isArray(value)) {
      return value.map(item => formatValue(item)).filter(Boolean).join(', ');
    }

    // Objects
    if (typeof value === 'object') {
      // Special cases for common YAML structures
      if ('description' in value) {
        const desc = formatValue(value.description);
        if ('requirements' in value) {
          const reqs = formatValue(value.requirements);
          return `${desc}\nRequirements: ${reqs}`;
        }
        return desc;
      }

      if ('implementation' in value && 'requirement' in value) {
        return `Implementation: ${formatValue(value.implementation)}\nRequirement: ${formatValue(value.requirement)}`;
      }

      // Single Phase key objects
      const keys = Object.keys(value);
      if (keys.length === 1 && keys[0].startsWith('Phase')) {
        return `${keys[0]}: ${formatValue(value[keys[0]])}`;
      }

      // General object formatting
      try {
        return Object.entries(value)
          .map(([key, val]) => `${key}: ${formatValue(val)}`)
          .filter(Boolean)
          .join('\n');
      } catch {
        return JSON.stringify(value, null, 2);
      }
    }

    // Fallback
    return String(value);
  } catch (error) {
    console.error('Error in formatValue:', error);
    return '[Error formatting value]';
  }
};
