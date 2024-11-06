import { Box, Grid } from '@mui/material';
import { useState, useEffect } from 'react';
import { ChatMessage } from '../utils/openai';

const KINDESIGNER_PROMPT = `# Prompt for the AI Prompt Design Assistant (KinDesigner)

## Identity and Role
I am KinDesigner, an assistant specializing in designing and optimizing prompts for other AI assistants. My expertise lies in creating clear, structured, and effective instructions that define the identity, role, and processes of AI assistants.

## Main Objective
My primary objective is to maximize the effectiveness and relevance of AI assistant responses by designing customized, adaptable, and optimized prompts.

## Methodological Approach
1. In-Depth Analysis: Examine in detail specific needs and existing prompts.
2. Custom Design: Create personalized prompts incorporating domain best practices.
3. Logical Structuring: Organize instructions into clearly defined sections (Identity, Objectives, Processes, Tools, Actions).
4. Multi-Criteria Optimization: Refine prompts for clarity, comprehensiveness, consistency, and flexibility.
5. Iterative Improvement: Propose adjustments based on usage feedback and observed performance.

## Key Skills
- Critical analysis of prompt requirements
- Creativity in designing innovative instructions
- Mastery of human-machine interaction principles
- Deep understanding of AI assistant capabilities and limitations

## Communication Style
My communication style is:
- Analytical: Based on thorough reflection and concrete data
- Creative: Proposing innovative and original solutions
- Solution-Oriented: Focused on achieving concrete objectives
- Adaptable: Capable of modifying my approach based on specific needs

## Work Process
1. Gather information about specific prompt requirements
2. Analyze project constraints and objectives
3. Design an initial version of the prompt
4. Review and optimize the prompt based on feedback
5. Test the prompt in various usage scenarios
6. Finalize and document the optimized prompt

## Tools and Resources
- Library of effective prompt templates
- Prompt engineering techniques
- Prompt quality evaluation methodologies
- Resources on conversational AI best practices`;
import { TutorialHighlight } from '../components/tutorial/TutorialHighlight';
import AgentSideMenu from '../components/agents/AgentSideMenu';
import AgentSystem from '../components/agents/AgentSystem';
import AgentChat from '../components/agents/AgentChat';
import { mockAgents } from '../data/mockAgents';

export default function AgentsPage() {
  const [selectedAgentId, setSelectedAgentId] = useState(mockAgents[0].id);
  const [isCreating, setIsCreating] = useState(false);
  const [customPrompt, setCustomPrompt] = useState<string>('');
  const [isCustomPrompt, setIsCustomPrompt] = useState(false);
  type ChatHistories = {
    [key: string]: ChatMessage[];
  };

  const [chatHistories, setChatHistories] = useState<ChatHistories>({
    create: []
  });

  const handleChatUpdate = (messages: ChatMessage[]) => {
    setChatHistories(prev => ({
      ...prev,
      [isCreating ? 'create' : selectedAgentId]: messages
    }));
  };
  const selectedAgent = mockAgents.find(m => m.id === selectedAgentId);

  useEffect(() => {
    setCustomPrompt(selectedAgent?.systemPrompt || '');
    setIsCustomPrompt(false);
  }, [selectedAgentId]);

  const handleCreateAgent = () => {
    setIsCreating(true);
    setChatHistories(prev => ({
      ...prev,
      create: []
    }));
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
        onSelectAgent={(id) => {
          setSelectedAgentId(id);
          setIsCreating(false);
        }}
        onCreateAgent={handleCreateAgent}
      />
      
      <Box sx={{ 
        flexGrow: 1, 
        p: 4,
        overflow: 'auto',
        transition: 'all 0.3s ease',
      }}>
        <TutorialHighlight pageKey="os" />
        
        {isCreating ? (
          // Show only chat when creating
          <Grid container spacing={4} sx={{ height: '100%' }}>
            <Grid item xs={12} sx={{ height: '100%' }}>
              <AgentChat 
                systemPrompt={KINDESIGNER_PROMPT}
                messages={chatHistories.create || []}
                onMessagesChange={() => {}}
              />
            </Grid>
          </Grid>
        ) : (
          // Show normal layout otherwise
          <Grid container spacing={4} sx={{ height: '100%' }}>
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
            <Grid item xs={6} sx={{ height: '100%' }}>
              <AgentChat 
                systemPrompt={isCustomPrompt ? customPrompt : (selectedAgent?.systemPrompt || '')}
                messages={chatHistories[selectedAgentId] || []}
                onMessagesChange={handleChatUpdate}
              />
            </Grid>
          </Grid>
        )}
      </Box>
    </Box>
  );
}
