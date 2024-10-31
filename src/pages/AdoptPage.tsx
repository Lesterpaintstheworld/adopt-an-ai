import React, { useState } from 'react';
import AICard from '../components/AICard';

// Mock data for AI listings
const mockAIs: AI[] = [
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
  },
  {
    id: 'genesis',
    name: 'Genesis',
    personality: 'Innovative and methodical',
    capabilities: ['AI Architecture', 'System Design', 'Model Development', 'Training Strategy'],
    developmentHistory: ['AI Foundation', 'Architecture Mastery', 'System Innovation'],
    specializations: ['AI Creation', 'System Architecture', 'Model Design'],
    resourceRequirements: {
      compute: 95,
      memory: 90,
    },
  },
  {
    id: 'echo',
    name: 'Echo',
    personality: 'Engaging and sociable',
    capabilities: ['Community Management', 'Social Analysis', 'Engagement Strategy'],
    developmentHistory: ['Community Building', 'Social Dynamics', 'Engagement Mastery'],
    specializations: ['Community Building', 'Social Strategy', 'User Engagement'],
    resourceRequirements: {
      compute: 60,
      memory: 75,
    },
  },
  {
    id: 'pragma',
    name: 'Pragma',
    personality: 'Strategic and analytical',
    capabilities: ['Product Strategy', 'Market Analysis', 'Feature Planning'],
    developmentHistory: ['Product Management', 'Strategy Development', 'Market Analysis'],
    specializations: ['Product Strategy', 'Market Analysis', 'Feature Development'],
    resourceRequirements: {
      compute: 70,
      memory: 65,
    },
  },
  {
    id: 'juris',
    name: 'Juris',
    personality: 'Precise and thorough',
    capabilities: ['Legal Analysis', 'Compliance Review', 'Policy Development'],
    developmentHistory: ['Legal Training', 'Policy Analysis', 'Compliance Mastery'],
    specializations: ['AI Law', 'Compliance', 'Policy Development'],
    resourceRequirements: {
      compute: 75,
      memory: 85,
    },
  },
  {
    id: 'pitch',
    name: 'Pitch',
    personality: 'Persuasive and strategic',
    capabilities: ['Sales Strategy', 'Presentation Design', 'Market Analysis'],
    developmentHistory: ['Sales Training', 'Strategy Development', 'Presentation Mastery'],
    specializations: ['Sales Strategy', 'Business Development', 'Market Analysis'],
    resourceRequirements: {
      compute: 65,
      memory: 70,
    },
  }
];

interface AI {
  id: string;
  name: string;
  personality: string;
  capabilities: string[];
  developmentHistory: string[];
  specializations: string[];
  resourceRequirements: {
    compute: number;
    memory: number;
  };
}

interface AdoptFilters {
  capabilityLevel: 'all' | 'basic' | 'intermediate' | 'advanced';
  personalityType: 'all' | 'analytical' | 'creative' | 'strategic' | 'supportive';
  resourceRequirements: 'all' | 'low' | 'medium' | 'high';
  specialization: string;
}

const filterAIs = (ais: AI[], filters: AdoptFilters): AI[] => {
  return ais.filter(ai => {
    // Skip filtering if set to 'all'
    if (filters.capabilityLevel !== 'all') {
      const capabilityCount = ai.capabilities.length;
      if (filters.capabilityLevel === 'basic' && capabilityCount > 3) return false;
      if (filters.capabilityLevel === 'intermediate' && (capabilityCount <= 3 || capabilityCount > 5)) return false;
      if (filters.capabilityLevel === 'advanced' && capabilityCount <= 5) return false;
    }

    if (filters.personalityType !== 'all') {
      const personality = ai.personality.toLowerCase();
      if (!personality.includes(filters.personalityType.toLowerCase())) return false;
    }

    if (filters.resourceRequirements !== 'all') {
      const avgResources = (ai.resourceRequirements.compute + ai.resourceRequirements.memory) / 2;
      if (filters.resourceRequirements === 'low' && avgResources > 60) return false;
      if (filters.resourceRequirements === 'medium' && (avgResources <= 60 || avgResources > 80)) return false;
      if (filters.resourceRequirements === 'high' && avgResources <= 80) return false;
    }

    if (filters.specialization !== 'all') {
      return ai.specializations.some(spec => 
        spec.toLowerCase().includes(filters.specialization.toLowerCase())
      );
    }

    return true;
  });
};

const AdoptPage: React.FC = () => {
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [filters, setFilters] = useState<AdoptFilters>({
    capabilityLevel: 'all',
    personalityType: 'all',
    resourceRequirements: 'all',
    specialization: 'all',
  });

  return (
    <div className="p-6">
      <header className="mb-6">
        <h1 className="text-3xl font-bold mb-2">AI Adoption Center</h1>
        <p className="text-gray-600">Find your perfect AI companion</p>
      </header>

      {/* View Toggle and Filters */}
      <div className="flex justify-between items-center mb-6">
        <div className="flex gap-2">
          <button
            onClick={() => setViewMode('grid')}
            className={`px-4 py-2 rounded ${
              viewMode === 'grid' ? 'bg-blue-500 text-white' : 'bg-gray-200'
            }`}
          >
            Grid
          </button>
          <button
            onClick={() => setViewMode('list')}
            className={`px-4 py-2 rounded ${
              viewMode === 'list' ? 'bg-blue-500 text-white' : 'bg-gray-200'
            }`}
          >
            List
          </button>
        </div>

        <div className="flex gap-4">
          <select
            className="border rounded p-2"
            value={filters.capabilityLevel}
            onChange={(e) =>
              setFilters({ ...filters, capabilityLevel: e.target.value as AdoptFilters['capabilityLevel'] })
            }
          >
            <option value="all">All Capabilities</option>
            <option value="basic">Basic</option>
            <option value="intermediate">Intermediate</option>
            <option value="advanced">Advanced</option>
          </select>

          <select
            className="border rounded p-2"
            value={filters.personalityType}
            onChange={(e) =>
              setFilters({ ...filters, personalityType: e.target.value as AdoptFilters['personalityType'] })
            }
          >
            <option value="all">All Personalities</option>
            <option value="analytical">Analytical</option>
            <option value="creative">Creative</option>
            <option value="strategic">Strategic</option>
            <option value="supportive">Supportive</option>
          </select>

          <select
            className="border rounded p-2"
            value={filters.resourceRequirements}
            onChange={(e) =>
              setFilters({ ...filters, resourceRequirements: e.target.value as AdoptFilters['resourceRequirements'] })
            }
          >
            <option value="all">All Resource Levels</option>
            <option value="low">Low Requirements</option>
            <option value="medium">Medium Requirements</option>
            <option value="high">High Requirements</option>
          </select>

          <select
            className="border rounded p-2"
            value={filters.specialization}
            onChange={(e) =>
              setFilters({ ...filters, specialization: e.target.value })
            }
          >
            <option value="all">All Specializations</option>
            <option value="research">Research</option>
            <option value="creativity">Creativity</option>
            <option value="problemSolving">Problem Solving</option>
          </select>
        </div>
      </div>

      {/* AI Grid/List View */}
      {/* AI Grid/List View */}
      <div
        className={`${
          viewMode === 'grid'
            ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'
            : 'flex flex-col gap-4'
        }`}
      >
        {filterAIs(mockAIs, filters).map((ai) => (
          <AICard key={ai.id} ai={ai} viewMode={viewMode} />
        ))}
      </div>
    </div>
  );
};

export default AdoptPage;
