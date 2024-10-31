interface AICardProps {
  ai: {
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
  };
  viewMode: 'grid' | 'list';
}

const AICard: React.FC<AICardProps> = ({ ai, viewMode }) => {
  return (
    <div className={`border rounded-lg p-4 shadow-sm ${
      viewMode === 'list' ? 'flex gap-4' : ''
    }`}>
      <div className="flex-shrink-0">
        <div className="w-16 h-16 bg-gray-200 rounded-full mb-2" />
      </div>
      
      <div className="flex-grow">
        <h3 className="text-xl font-semibold mb-2">{ai.name}</h3>
        <p className="text-gray-600 mb-4">{ai.personality}</p>
        
        <div className="mb-4">
          <h4 className="text-sm font-semibold mb-1">Capabilities</h4>
          <div className="flex flex-wrap gap-2">
            {ai.capabilities.map((capability) => (
              <span
                key={capability}
                className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-sm"
              >
                {capability}
              </span>
            ))}
          </div>
        </div>

        <div className="mb-4">
          <h4 className="text-sm font-semibold mb-1">Specializations</h4>
          <div className="flex flex-wrap gap-2">
            {ai.specializations.map((spec) => (
              <span
                key={spec}
                className="bg-green-100 text-green-800 px-2 py-1 rounded-full text-sm"
              >
                {spec}
              </span>
            ))}
          </div>
        </div>

        <div className="flex justify-between items-center">
          <div className="text-sm">
            <div>Compute: {ai.resourceRequirements.compute}%</div>
            <div>Memory: {ai.resourceRequirements.memory}%</div>
          </div>
          <div className="flex gap-2">
            <button className="bg-gray-100 text-gray-800 px-4 py-2 rounded hover:bg-gray-200">
              Details
            </button>
            <button className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">
              Adopt
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AICard;
