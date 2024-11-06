import { List, ListItem, ListItemButton, ListItemText, Button } from '@mui/material';
import { styled } from '@mui/material/styles';
import AddIcon from '@mui/icons-material/Add';

const StyledList = styled(List)(({ theme }) => ({
  width: '240px',
  height: '100%',
  backgroundColor: 'rgba(0, 0, 0, 0.4)',
  backdropFilter: 'blur(20px)',
  borderRight: '1px solid rgba(255, 255, 255, 0.1)',
  '& .MuiListItemButton-root': {
    padding: theme.spacing(2),
    '&.Mui-selected': {
      backgroundColor: 'rgba(255, 255, 255, 0.1)',
      '&:hover': {
        backgroundColor: 'rgba(255, 255, 255, 0.15)',
      }
    },
    '&:hover': {
      backgroundColor: 'rgba(255, 255, 255, 0.05)',
    }
  },
  '& .MuiListItemText-primary': {
    fontSize: '1.1rem',
    fontWeight: 500,
  }
}));

const CreateButton = styled(Button)(({ theme }) => ({
  width: '90%',
  margin: '10px auto',
  padding: theme.spacing(1.5),
  backgroundColor: theme.palette.primary.main,
  color: theme.palette.primary.contrastText,
  '&:hover': {
    backgroundColor: theme.palette.primary.dark,
  },
  display: 'flex',
  gap: theme.spacing(1),
  justifyContent: 'center',
  alignItems: 'center',
}));

import { Agent } from '../../types/database';

interface AgentSideMenuProps {
  agents: Agent[];
  selectedAgent: string;
  onSelectAgent: (id: string) => void;
  onCreateAgent?: () => void;
}

export default function AgentSideMenu({ 
  agents, 
  selectedAgent, 
  onSelectAgent,
  onCreateAgent = () => {}
}: AgentSideMenuProps) {
  return (
    <StyledList>
      <ListItem sx={{ display: 'flex', justifyContent: 'center' }}>
        <CreateButton
          variant="contained"
          onClick={onCreateAgent}
          startIcon={<AddIcon />}
        >
          Create Agent
        </CreateButton>
      </ListItem>
      {agents.map((agent) => (
        <ListItem key={agent.id} disablePadding>
          <ListItemButton 
            selected={selectedAgent === agent.id}
            onClick={() => onSelectAgent(agent.id)}
          >
            <ListItemText primary={agent.name} />
          </ListItemButton>
        </ListItem>
      ))}
    </StyledList>
  );
}
