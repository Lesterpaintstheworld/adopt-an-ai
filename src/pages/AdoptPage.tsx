import React, { useState } from 'react';
import { MainLayout } from '../components/layout/MainLayout';
import AICard from '../components/AICard';
import { AI, AdoptFilters } from '../types/ai';
import { mockAIs } from '../data/mockAIs';
import { filterAIs } from '../utils/filterAIs';

const AdoptPage: React.FC = () => {
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [filters, setFilters] = useState<AdoptFilters>({
    capabilityLevel: 'all',
    personalityType: 'all',
    resourceRequirements: 'all',
    specialization: 'all',
  });

  if (error) {
    return (
      <MainLayout>
        <div className="p-6 text-red-600">
          Error loading AI adoption center: {error}
        </div>
      </MainLayout>
    );
  }

  const filteredAIs = filterAIs(mockAIs, filters);

  return (
    <MainLayout>
      <div className="max-w-7xl mx-auto p-6">
        <header className="mb-6">
          <h1 className="text-3xl font-bold mb-2">AI Adoption Center</h1>
          <p className="text-gray-600">Find your perfect AI companion</p>
        </header>

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

        {isLoading ? (
          <div className="flex justify-center items-center min-h-[400px]">
            <div className="text-gray-600">Loading AIs...</div>
          </div>
        ) : filteredAIs.length === 0 ? (
          <div className="text-center py-8 text-gray-600">
            No AIs match your current filters. Try adjusting your criteria.
          </div>
        ) : (
          <div className={`${
            viewMode === 'grid'
              ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'
              : 'flex flex-col gap-4'
          }`}>
            {filteredAIs.map((ai) => (
              <AICard key={ai.id} ai={ai} viewMode={viewMode} />
            ))}
          </div>
        )}
      </div>
    </MainLayout>
  );
};