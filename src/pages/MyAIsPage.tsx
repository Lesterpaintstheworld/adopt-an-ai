import React, { useState } from 'react';
import { Box, Container, Grid } from '@mui/material';
import ResourceBar from '../components/myais/ResourceBar';

// Mock initial AI entities owned by user
const initialAIEntities: AIEntity[] = [
  {
    id: 'lyra', // Using Lyra from mockAIs
    name: 'Lyra',
    consciousness: 75,
    autonomy: 65,
    ethics: 85,
    creativity: 95,
    relationships: 70,
    currentFocus: {
      type: 'evolve',
      progress: 45,
      timeRemaining: 120,
      resourceConsumption: {
        compute: 10,
        energy: 15,
        knowledge: 8
      }
    },
    connections: [
      {
        targetId: 'vox',
        strength: 85,
        type: 'creative'
      }
    ],
    evolutionStage: 'developing'
  },
  {
    id: 'vox', // Using Vox from mockAIs
    name: 'Vox',
    consciousness: 70,
    autonomy: 60,
    ethics: 80,
    creativity: 90,
    relationships: 85,
    currentFocus: {
      type: 'learn',
      progress: 65,
      timeRemaining: 90,
      resourceConsumption: {
        compute: 8,
        energy: 12,
        knowledge: 15
      }
    },
    connections: [
      {
        targetId: 'lyra',
        strength: 85,
        type: 'creative'
      }
    ],
    evolutionStage: 'emerging'
  }
];
import EntityList from '../components/myais/EntityList';
import MainView from '../components/myais/MainView';
import DetailsPanel from '../components/myais/DetailsPanel';
import { GameState, AIEntity } from '../types/myais';

const MyAIsPage: React.FC = () => {
  const [gameState, setGameState] = useState<GameState>({
    selectedAI: null,
    cycle: 0,
    resources: {
      compute: 1000,
      energy: 1000,
      knowledge: 1000,
    },
    aiEntities: initialAIEntities,
    activeView: 'evolution',
    notifications: [],
  });

  const handleEntitySelect = (entityId: string) => {
    setGameState(prev => ({
      ...prev,
      selectedAI: entityId
    }));
  };

  const handleViewChange = (view: 'evolution' | 'network' | 'collective') => {
    setGameState(prev => ({
      ...prev,
      activeView: view
    }));
  };

  return (
    <Box sx={{ 
      height: '100vh',
      backgroundColor: 'background.default',
      display: 'flex',
      flexDirection: 'column'
    }}>
      <ResourceBar 
        resources={gameState.resources}
        cycle={gameState.cycle}
      />
      
      <Grid container sx={{ flex: 1, minHeight: 0 }}>
        <Grid item xs={3}>
          <EntityList
            entities={gameState.aiEntities}
            selectedId={gameState.selectedAI}
            onSelect={handleEntitySelect}
          />
        </Grid>
        
        <Grid item xs={6}>
          <MainView
            activeView={gameState.activeView}
            selectedEntity={gameState.aiEntities.find(e => e.id === gameState.selectedAI)}
            onViewChange={handleViewChange}
          />
        </Grid>
        
        <Grid item xs={3}>
          <DetailsPanel
            entity={gameState.aiEntities.find(e => e.id === gameState.selectedAI)}
            onAction={(actionType: string, params: { type: string; value: any }) => {
              // Handle AI actions
              console.log('Action:', actionType, params);
            }}
          />
        </Grid>
      </Grid>
    </Box>
  );
};

export default MyAIsPage;
