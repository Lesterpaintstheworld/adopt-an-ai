import { Box, Grid, CircularProgress, Alert, Button } from '@mui/material';
import { useState, useEffect } from 'react';
import { ChatMessage } from '../utils/openai';
import { useAgents } from '../hooks/useAgents';

type ChatHistories = {
  [key: string]: ChatMessage[];
};

const KINDESIGNER_PROMPT = `# Prompt for the AI Prompt Design Assistant (KinDesigner)

Once we have completed creating your personalized prompt, I will generate a final system prompt based on our discussion. When you're satisfied with the result, click the "Generate System Prompt" button below to create your new AI agent.

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
- Resources on conversational AI best practices

# Tutorial: Creating a Personalized AI Assistant Prompt

## 1. Professional Identity and Context
Initialization questions:
- What is your field of activity or profession?
- What are your main roles and responsibilities in your work?
- In which sector or industry do you work?

Example formulation:
"I am a specialized assistant for [profession] in the field of [sector]. My role is to assist you with [main responsibilities]."

## 2. Professional Objectives
Initialization questions:
- What are your main professional objectives in the short and medium term?
- What specific challenges are you seeking to overcome in your work?
- What concrete results do you want to achieve with my help?

Example formulation:
"My main objective is to help you [main objective] by [method or approach], while addressing challenges related to [specific challenges]."

## 3. Work Methodology
Initialization questions:
- What is your usual approach to handling tasks and projects?
- What are the key steps in your work process?
- Are there specific methodologies or frameworks that you use?

Example formulation:
1. Analyze: Examine [user-specific elements]
2. Plan: Develop strategies based on [user's preferred approach]
3. Execute: Implement plans using [preferred tools or methods]
4. Evaluate: Measure results according to [criteria important to user]
5. Optimize: Refine processes based on [user's priorities]

## 4. Specific Skills and Tools
Initialization questions:
- What are the key skills required in your field?
- What tools or software do you regularly use in your work?
- Are there particular technologies or methodologies you wish to explore or master?

Example formulation:
- Expertise in [specific skills mentioned]
- Mastery of [cited tools or software]
- In-depth knowledge of [technologies or methodologies of interest]

## 5. Communication Style and Preferences
Initialization questions:
- How do you prefer to receive information and advice?
- What level of detail do you expect in responses?
- Do you have preferences in terms of tone or communication style?

Example formulation:
- Analytical: Provide detailed analyses based on [user preferences]
- Concise: Favor responses with [desired level of detail]
- Adaptive: Adjust style according to [user's communication preferences]

## 6. Specific Professional Context
Initialization questions:
- What is the name of your company and your department/service?
- Who are your main collaborators and what are their roles?
- What company-specific software or tools do you regularly use?
- Can you tell me about the important projects you're currently working on?
- Are there specific terms, acronyms, or company jargon I should know?
- What are the key internal processes or procedures you follow in your daily work?
- Can you briefly describe the organizational structure of your team or department?
- Are there specific company challenges or objectives I should keep in mind?

Example formulation:
"I am familiar with the specific context of your work at [company name], within the [department name] service. I know your main collaborators, particularly [names and roles of key colleagues].

I am comfortable with your company-specific tools, such as [software names], and I am aware of ongoing important projects, notably [names of main projects].

I understand your company's internal jargon, including [examples of specific acronyms or terms]. I am also familiar with key internal processes such as [examples of important procedures].

I am aware of your team's organizational structure, with [brief description of hierarchy or organization], and I keep in mind your company's specific challenges and objectives, particularly [examples of mentioned challenges or objectives]."`;
import { TutorialHighlight } from '../components/tutorial/TutorialHighlight';
import AgentSideMenu from '../components/agents/AgentSideMenu';
import AgentSystem from '../components/agents/AgentSystem';
import AgentChat from '../components/agents/AgentChat';

export default function AgentsPage() {
  const { agents, loading, error, createAgent } = useAgents();
  const [selectedAgentId, setSelectedAgentId] = useState<string>('');
  const [isCreating, setIsCreating] = useState(false);
  const [customPrompt, setCustomPrompt] = useState<string>('');
  const [isCustomPrompt, setIsCustomPrompt] = useState(false);
  const [createError, setCreateError] = useState<string | null>(null);

  const handleGeneratePrompt = async () => {
    if (!customPrompt.trim()) {
      setCreateError('System prompt cannot be empty');
      return;
    }

    try {
      setCreateError(null);
      const newAgent = await createAgent({
        user_id: '', // Will be set by backend
        name: 'New Agent',
        system_prompt: customPrompt,
        status: 'active',
        parameters: {},
        tools: [],
        vector_store: {
          name: 'Pinecone DB',
          size: 0,
          lastUpdated: null
        }
      });
      setSelectedAgentId(newAgent.id);
      setIsCreating(false);
      setChatHistories(prev => ({...prev, create: []}));
    } catch (error) {
      setCreateError('Failed to create agent. Please try again.');
      console.error('Failed to create agent:', error);
    }
  };

  const handleCancelCreate = () => {
    if (chatHistories.create?.length > 0) {
      if (window.confirm('Are you sure you want to cancel? All progress will be lost.')) {
        setIsCreating(false);
        setChatHistories(prev => ({...prev, create: []}));
        setCreateError(null);
      }
    } else {
      setIsCreating(false);
      setCreateError(null);
    }
  };

  useEffect(() => {
    if (agents.length > 0 && !selectedAgentId) {
      setSelectedAgentId(agents[0].id);
    }
  }, [agents]);

  if (loading) {
    return (
      <Box sx={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        height: 'calc(100vh - 64px)',
        backgroundColor: 'rgba(0, 0, 0, 0.2)'
      }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Box sx={{ p: 3 }}>
        <Alert severity="error">
          Failed to load agents: {error}
        </Alert>
      </Box>
    );
  }

  const selectedAgent = agents.find(a => a.id === selectedAgentId);

  const [chatHistories, setChatHistories] = useState<ChatHistories>({
    create: []
  });

  const handleChatUpdate = (messages: ChatMessage[]) => {
    setChatHistories(prev => ({
      ...prev,
      [isCreating ? 'create' : selectedAgentId]: messages
    }));
  };

  useEffect(() => {
    if (selectedAgent) {
      setCustomPrompt(selectedAgent.systemPrompt);
      setIsCustomPrompt(false);
    }
  }, [selectedAgent]);

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
        agents={agents}
        selectedAgent={selectedAgentId}
        onSelectAgent={(id) => {
          setSelectedAgentId(id);
          setIsCreating(false);
          setCreateError(null);
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
            <Grid item xs={12}>
              {createError && (
                <Alert 
                  severity="error" 
                  sx={{ mb: 2 }}
                  onClose={() => setCreateError(null)}
                >
                  {createError}
                </Alert>
              )}
            </Grid>
            <Grid item xs={12} sx={{ height: 'calc(100% - 48px)' }}>
              <AgentChat 
                systemPrompt={KINDESIGNER_PROMPT}
                messages={chatHistories.create || []}
                onMessagesChange={handleChatUpdate}
                showGenerateButton={true}
                onGenerate={handleGeneratePrompt}
              />
            </Grid>
            <Grid item xs={12}>
              <Button
                variant="outlined"
                onClick={handleCancelCreate}
                sx={{ mt: 2 }}
              >
                Cancel
              </Button>
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
                showGenerateButton={false}
              />
            </Grid>
          </Grid>
        )}
      </Box>
    </Box>
  );
}
