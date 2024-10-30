export interface TagStyle {
  background: string;
  color: string;
  palette: string;
  theme: string;
  borderColor: string;
}

export const TAG_STYLES: { [key: string]: TagStyle } = {
  'CREATIVE': {
    background: '#FFE0E9',
    color: '#D81B60',
    borderColor: '#D81B60',
    palette: 'vibrant pink and magenta energy streams with creative sparks',
    theme: 'artistic, flowing energy streams, creative sparks'
  },
  'TECHNICAL': {
    background: '#E3F2FD',
    color: '#1976D2',
    borderColor: '#1976D2',
    palette: 'glowing blue and cyan circuit patterns',
    theme: 'technical, circuit patterns, data streams'
  },
  'SOCIAL': {
    background: '#E8F5E9',
    color: '#388E3C',
    borderColor: '#388E3C',
    palette: 'harmonious green and emerald auras',
    theme: 'interconnected nodes, organic patterns'
  },
  'INTEGRATION': {
    background: '#EDE7F6',
    color: '#5E35B1',
    borderColor: '#5E35B1',
    palette: 'deep purple and violet connection streams',
    theme: 'interwoven patterns, network nodes'
  },
  'COGNITIVE': {
    background: '#FFF3E0',
    color: '#E65100',
    borderColor: '#E65100',
    palette: 'warm orange and gold neural patterns',
    theme: 'brain-like structures, synaptic connections'
  },
  'OPERATIONAL': {
    background: '#F3E5F5',
    color: '#7B1FA2',
    borderColor: '#7B1FA2',
    palette: 'royal purple and silver mechanisms',
    theme: 'gears, efficiency symbols, flow patterns'
  }
};

export const getTagColor = (tag: string) => {
  const tagType = tag.split(' ')[1];
  return TAG_STYLES[tagType] || { color: '#666', borderColor: '#666' };
};
