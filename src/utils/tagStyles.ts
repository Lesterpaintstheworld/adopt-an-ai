export interface TagStyle {
  background: string;
  color: string;
  palette: string;
  theme: string;
}

export const TAG_STYLES: { [key: string]: TagStyle } = {
  'CREATIVE': {
    background: '#FFE0E9',
    color: '#D81B60',
    palette: 'vibrant pink and magenta energy streams with creative sparks',
    theme: 'artistic, flowing energy streams, creative sparks'
  },
  'TECHNICAL': {
    background: '#E3F2FD',
    color: '#1976D2',
    palette: 'glowing blue and cyan circuit patterns',
    theme: 'technical, circuit patterns, data streams'
  },
  'SOCIAL': {
    background: '#E8F5E9',
    color: '#388E3C',
    palette: 'harmonious green and emerald auras',
    theme: 'interconnected nodes, organic patterns'
  },
  'INTEGRATION': {
    background: '#EDE7F6',
    color: '#5E35B1',
    palette: 'deep purple and violet connection streams',
    theme: 'interwoven patterns, network nodes'
  },
  'COGNITIVE': {
    background: '#FFF3E0',
    color: '#E65100',
    palette: 'warm orange and gold neural patterns',
    theme: 'brain-like structures, synaptic connections'
  },
  'OPERATIONAL': {
    background: '#F3E5F5',
    color: '#7B1FA2',
    palette: 'royal purple and silver mechanisms',
    theme: 'gears, efficiency symbols, flow patterns'
  }
};
export const TAG_STYLES: { [key: string]: { color: string; borderColor: string; theme: string; palette: string } } = {
  TECHNICAL: {
    color: '#2196f3',
    borderColor: '#2196f3',
    theme: 'mechanical and technological elements',
    palette: 'blue and silver metallic colors'
  },
  CREATIVE: {
    color: '#9c27b0',
    borderColor: '#9c27b0',
    theme: 'artistic and imaginative elements',
    palette: 'purple and gold accents'
  },
  SOCIAL: {
    color: '#4caf50',
    borderColor: '#4caf50',
    theme: 'connection and communication elements',
    palette: 'green and white harmonious colors'
  },
  INTEGRATION: {
    color: '#ff9800',
    borderColor: '#ff9800',
    theme: 'interconnected network elements',
    palette: 'orange and blue complementary colors'
  },
  COGNITIVE: {
    color: '#e91e63',
    borderColor: '#e91e63',
    theme: 'neural and thought-process elements',
    palette: 'pink and electric blue highlights'
  },
  OPERATIONAL: {
    color: '#795548',
    borderColor: '#795548',
    theme: 'systematic and procedural elements',
    palette: 'brown and bronze industrial colors'
  }
};

export const getTagColor = (tag: string) => {
  const tagType = tag.split(' ')[1];
  return TAG_STYLES[tagType] || { color: '#666', borderColor: '#666' };
};
