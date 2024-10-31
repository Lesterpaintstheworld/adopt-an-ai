import React from 'react';
import {
  Box,
  Paper,
  ToggleButton,
  ToggleButtonGroup,
  Typography
} from '@mui/material';
import { AIEntity } from '../../types/myais';
import { MYAIS_THEME } from '../../theme/myais';

// Import view components (we'll create these next)
import EvolutionView from './views/EvolutionView';
import NetworkView from './views/NetworkView';
import CollectiveView from './views/CollectiveView';

interface MainViewProps {
  activeView: 'evolution' | 'network' | 'collective';
  selectedEntity: AIEntity | undefined;
  onViewChange: (view: 'evolution' | 'network' | 'collective') => void;
}

const MainView: React.FC<MainViewProps> = ({
  activeView,
  selectedEntity,
  onViewChange
}) => {
  const handleViewChange = (
    event: React.MouseEvent<HTMLElement>,
    newView: 'evolution' | 'network' | 'collective' | null
  ) => {
    if (newView) {
      onViewChange(newView);
    }
  };

  return (
    <Paper 
      sx={{ 
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        borderRadius: 0,
        backgroundColor: 'background.paper'
      }}
    >
      {/* Header with view selection */}
      <Box sx={{ 
        p: MYAIS_THEME.spacing.panel.padding,
        borderBottom: 1,
        borderColor: 'divider',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center'
      }}>
        <Typography variant="h6">
          {selectedEntity ? selectedEntity.name : 'Select an AI'}
        </Typography>
        
        <ToggleButtonGroup
          value={activeView}
          exclusive
          onChange={handleViewChange}
          size="small"
        >
          <ToggleButton value="evolution">
            Evolution
          </ToggleButton>
          <ToggleButton value="network">
            Network
          </ToggleButton>
          <ToggleButton value="collective">
            Collective
          </ToggleButton>
        </ToggleButtonGroup>
      </Box>

      {/* Main content area */}
      <Box sx={{ 
        flex: 1,
        overflow: 'auto',
        p: MYAIS_THEME.spacing.panel.padding
      }}>
        {!selectedEntity ? (
          <Box sx={{ 
            display: 'flex', 
            justifyContent: 'center', 
            alignItems: 'center',
            height: '100%'
          }}>
            <Typography color="text.secondary">
              Select an AI to view details
            </Typography>
          </Box>
        ) : (
          <>
            {activeView === 'evolution' && (
              <EvolutionView entity={selectedEntity} />
            )}
            {activeView === 'network' && (
              <NetworkView entity={selectedEntity} />
            )}
            {activeView === 'collective' && (
              <CollectiveView entity={selectedEntity} />
            )}
          </>
        )}
      </Box>
    </Paper>
  );
};

export default MainView;
