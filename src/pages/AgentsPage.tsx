import { Box, Grid } from '@mui/material';
import { useState } from 'react';
import { TutorialHighlight } from '../components/tutorial/TutorialHighlight';
import AgentSideMenu from '../components/agents/AgentSideMenu';
import AgentSystem from '../components/agents/AgentSystem';
import AgentChat from '../components/agents/AgentChat';
import { mockAgents } from '../data/mockAgents';

export default function AgentsPage() {
  const [selectedAgentId, setSelectedAgentId] = useState(mockAgents[0].id);
  const selectedAgent = mockAgents.find(m => m.id === selectedAgentId);

  return (
    <Box sx={{ 
      display: 'flex', 
      height: 'calc(100vh - 64px)',
      overflow: 'hidden',
      backgroundColor: 'rgba(0, 0, 0, 0.2)',
    }}>
      <AgentSideMenu 
        agents={mockAgents}
        selectedAgent={selectedAgentId}
        onSelectAgent={setSelectedAgentId}
      />
      
      <Box sx={{ 
        flexGrow: 1, 
        p: 4,
        overflow: 'auto',
        transition: 'all 0.3s ease',
      }}>
        <TutorialHighlight pageKey="os" />
        
        <Grid container spacing={4} sx={{ height: '100%' }}>
          {/* System Prompt - Left half */}
          <Grid item xs={6} sx={{ height: '100%' }}>
            <AgentSystem 
              prompt={selectedAgent?.systemPrompt || ''}
              readOnly
            />
          </Grid>

          {/* Chat - Right half */}
          <Grid item xs={6} sx={{ height: '100%' }}>
            <AgentChat systemPrompt={selectedAgent?.systemPrompt || ''} />
          </Grid>
        </Grid>
      </Box>
    </Box>
  );
}
