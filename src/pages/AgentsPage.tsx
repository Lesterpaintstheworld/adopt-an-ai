import { Box, Grid } from '@mui/material';
import { useState, useEffect } from 'react';
import { ChatMessage } from '../utils/openai';
import { TutorialHighlight } from '../components/tutorial/TutorialHighlight';
import AgentSideMenu from '../components/agents/AgentSideMenu';
import AgentSystem from '../components/agents/AgentSystem';
import AgentChat from '../components/agents/AgentChat';
import { mockAgents } from '../data/mockAgents';

export default function AgentsPage() {
  const [selectedAgentId, setSelectedAgentId] = useState(mockAgents[0].id);
  const [customPrompt, setCustomPrompt] = useState<string>('');
  const [isCustomPrompt, setIsCustomPrompt] = useState(false);
  const [chatHistories, setChatHistories] = useState<{[agentId: string]: ChatMessage[]}>({});

  const handleChatUpdate = (messages: ChatMessage[]) => {
    setChatHistories(prev => ({
      ...prev,
      [selectedAgentId]: messages
    }));
  };

  useEffect(() => {
    if (!(selectedAgentId in chatHistories)) {
      setChatHistories(prev => ({
        ...prev,
        [selectedAgentId]: []
      }));
    }
  }, [selectedAgentId]);
  const selectedAgent = mockAgents.find(m => m.id === selectedAgentId);

  useEffect(() => {
    setCustomPrompt(selectedAgent?.systemPrompt || '');
    setIsCustomPrompt(false);
  }, [selectedAgentId]);

  const handleCreateAgent = () => {
    // For now just console.log, you can implement the creation logic later
    console.log('Create agent clicked');
  };

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
        onCreateAgent={handleCreateAgent}
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
              prompt={isCustomPrompt ? customPrompt : (selectedAgent?.systemPrompt || '')}
              onChange={(newPrompt) => {
                setCustomPrompt(newPrompt);
                setIsCustomPrompt(true);
              }}
              readOnly={false}
            />
          </Grid>

          {/* Chat - Right half */}
          <Grid item xs={6} sx={{ height: '100%' }}>
            <AgentChat 
              systemPrompt={isCustomPrompt ? customPrompt : (selectedAgent?.systemPrompt || '')}
              messages={chatHistories[selectedAgentId] || []}
              onMessagesChange={handleChatUpdate}
            />
          </Grid>
        </Grid>
      </Box>
    </Box>
  );
}
