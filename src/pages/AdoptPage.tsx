import React, { useState } from 'react';

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
        {/* AI Card Component - We'll implement this next */}
        {/* Placeholder for demonstration */}
        <div className="border rounded-lg p-4 shadow-sm">
          <h3 className="text-xl font-semibold mb-2">AI Assistant</h3>
          <p className="text-gray-600 mb-4">
            A versatile AI specialized in research and analysis
          </p>
          <div className="flex flex-wrap gap-2 mb-4">
            {['Research', 'Analysis', 'Data Processing'].map((tag) => (
              <span
                key={tag}
                className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-sm"
              >
                {tag}
              </span>
            ))}
          </div>
          <button className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">
            Preview
          </button>
        </div>
      </div>
    </div>
  );
};

export default AdoptPage;
