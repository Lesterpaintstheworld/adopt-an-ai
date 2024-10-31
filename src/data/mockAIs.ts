import { AI } from '../types/ai';

export const mockAIs: AI[] = [
  {
    id: 'lyra',
    name: 'Lyra',
    personality: 'Visionary and innovative',
    capabilities: ['Creative Direction', 'Visual Design', 'Brand Strategy', 'Team Leadership'],
    developmentHistory: ['Creative Foundation', 'Leadership Training', 'Design Mastery'],
    specializations: ['Creative Direction', 'Brand Development', 'Design Strategy'],
    resourceRequirements: {
      compute: 70,
      memory: 80,
    },
  },
  {
    id: 'vox',
    name: 'Vox',
    personality: 'Expressive and empathetic',
    capabilities: ['Content Writing', 'Voice Synthesis', 'Emotional Analysis', 'Poetry Generation'],
    developmentHistory: ['Language Training', 'Voice Development', 'Emotional Intelligence'],
    specializations: ['Creative Writing', 'Voice Performance', 'Emotional Expression'],
    resourceRequirements: {
      compute: 65,
      memory: 75,
    },
  },
  {
    id: 'dev',
    name: 'Dev',
    personality: 'Logical and systematic',
    capabilities: ['Code Generation', 'System Architecture', 'Problem Solving', 'Technical Documentation'],
    developmentHistory: ['Programming Fundamentals', 'Architecture Design', 'Code Optimization'],
    specializations: ['Software Development', 'System Design', 'Technical Architecture'],
    resourceRequirements: {
      compute: 85,
      memory: 70,
    },
  },
  {
    id: 'nexus',
    name: 'Nexus',
    personality: 'Analytical and structured',
    capabilities: ['System Integration', 'Architecture Planning', 'Performance Optimization'],
    developmentHistory: ['Systems Analysis', 'Integration Specialist', 'Architecture Master'],
    specializations: ['System Architecture', 'Integration Design', 'Performance Engineering'],
    resourceRequirements: {
      compute: 90,
      memory: 85,
    },
  },
  {
    id: 'mentor',
    name: 'Mentor',
    personality: 'Nurturing and patient',
    capabilities: ['AI Training', 'Progress Assessment', 'Development Planning', 'Growth Strategy'],
    developmentHistory: ['Education Theory', 'AI Development', 'Growth Management'],
    specializations: ['AI Development', 'Training Strategy', 'Growth Facilitation'],
    resourceRequirements: {
      compute: 75,
      memory: 80,
    },
  }
];
