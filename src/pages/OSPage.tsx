import { Box, Grid } from '@mui/material';
import { useState } from 'react';
import { TutorialHighlight } from '../components/tutorial/TutorialHighlight';
import ModelSideMenu from '../components/os/ModelSideMenu';
import SystemPrompt from '../components/os/SystemPrompt';
import ModelTools from '../components/os/ModelTools';
import ModelMemory from '../components/os/ModelMemory';
import ModelParameters from '../components/os/ModelParameters';

// Example data - replace with real data
const models = [
  {
    id: 'gpt4',
    name: 'GPT-4',
    systemPrompt: 'You are a helpful AI assistant...',
    tools: [
      { id: 't1', name: 'Web Search', description: 'Search the internet' },
      { id: 't2', name: 'Calculator', description: 'Perform calculations' },
    ],
    vectorStore: {
      name: 'Pinecone DB',
      size: 1000000,
      lastUpdated: '2024-01-20',
    },
    parameters: [
      { name: 'Temperature', value: 0.7, description: 'Controls randomness' },
      { name: 'Max Tokens', value: 2048, description: 'Maximum response length' },
    ],
  },
];

export default function OSPage() {
  const [selectedModelId, setSelectedModelId] = useState(models[0].id);
  const selectedModel = models.find(m => m.id === selectedModelId);

  return (
    <Box sx={{ 
      display: 'flex', 
      height: 'calc(100vh - 64px)',
      overflow: 'hidden',
    }}>
      <ModelSideMenu 
        models={models}
        selectedModel={selectedModelId}
        onSelectModel={setSelectedModelId}
      />
      
      <Box sx={{ flexGrow: 1, p: 3, overflow: 'auto' }}>
        <TutorialHighlight pageKey="os" />
        
        <Grid container spacing={3} sx={{ height: '100%' }}>
          {/* System Prompt - Left half */}
          <Grid item xs={6} sx={{ height: '100%' }}>
            <SystemPrompt 
              prompt={selectedModel?.systemPrompt || ''}
              readOnly
            />
          </Grid>

          {/* Right half */}
          <Grid item xs={6}>
            <Grid container spacing={3} sx={{ height: '100%' }}>
              {/* Tools */}
              <Grid item xs={12}>
                <ModelTools tools={selectedModel?.tools || []} />
              </Grid>
              
              {/* Memory */}
              <Grid item xs={12}>
                <ModelMemory vectorStore={selectedModel?.vectorStore || {
                  name: '',
                  size: 0,
                  lastUpdated: '',
                }} />
              </Grid>
              
              {/* Parameters */}
              <Grid item xs={12}>
                <ModelParameters parameters={selectedModel?.parameters || []} />
              </Grid>
            </Grid>
          </Grid>
        </Grid>
      </Box>
    </Box>
  );
}
