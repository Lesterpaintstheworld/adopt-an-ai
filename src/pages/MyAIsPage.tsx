import React, { useState } from 'react';
import { Box, Container, Grid } from '@mui/material';
import ResourceBar from '../components/myais/ResourceBar';
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
    aiEntities: [], // Will be populated from your data source
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
            onAction={(actionType, params) => {
              // Handle AI actions
            }}
          />
        </Grid>
      </Grid>
    </Box>
  );
};

export default MyAIsPage;
