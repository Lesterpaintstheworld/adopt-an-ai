import React, { useState } from 'react';
import AICard from '../components/AICard';

// Mock data for AI listings
const mockAIs = [
  {
    id: '1',
    name: 'Research Assistant',
    personality: 'Analytical and methodical',
    capabilities: ['Data Analysis', 'Literature Review', 'Report Writing'],
    developmentHistory: ['Basic Training', 'Research Specialization'],
    specializations: ['Academic Research', 'Data Science'],
    resourceRequirements: {
      compute: 60,
      memory: 40,
    },
  },
  {
    id: '2',
    name: 'Creative Companion',
    personality: 'Imaginative and inspiring',
    capabilities: ['Story Writing', 'Art Direction', 'Brainstorming'],
    developmentHistory: ['Creativity Training', 'Art Appreciation'],
    specializations: ['Creative Writing', 'Visual Arts'],
    resourceRequirements: {
      compute: 50,
      memory: 70,
    },
  },
  {
    id: '3',
    name: 'Problem Solver',
    personality: 'Logical and systematic',
    capabilities: ['Algorithm Design', 'Pattern Recognition', 'Optimization'],
    developmentHistory: ['Logic Training', 'Problem-Solving Focus'],
    specializations: ['Mathematical Analysis', 'System Design'],
    resourceRequirements: {
      compute: 80,
      memory: 60,
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
  capabilityLevel: string;
  personalityType: string;
  resourceRequirements: string;
  specialization: string;
}

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
            onChange={(e) =>
              setFilters({ ...filters, capabilityLevel: e.target.value })
            }
          >
            <option value="all">All Capabilities</option>
            <option value="basic">Basic</option>
            <option value="intermediate">Intermediate</option>
            <option value="advanced">Advanced</option>
          </select>

          <select
            className="border rounded p-2"
            onChange={(e) =>
              setFilters({ ...filters, personalityType: e.target.value })
            }
          >
            <option value="all">All Personalities</option>
            <option value="analytical">Analytical</option>
            <option value="creative">Creative</option>
            <option value="supportive">Supportive</option>
          </select>

          <select
            className="border rounded p-2"
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
      <div
        className={`${
          viewMode === 'grid'
            ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'
            : 'flex flex-col gap-4'
        }`}
      >
        {mockAIs.map((ai) => (
          <AICard key={ai.id} ai={ai} viewMode={viewMode} />
        ))}
      </div>
    </div>
  );
};

export default AdoptPage;
