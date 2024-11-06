import { List, ListItem, ListItemButton, ListItemText } from '@mui/material';
import { styled } from '@mui/material/styles';

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

interface AgentSideMenuProps {
  agents: Array<{
    id: string;
    name: string;
  }>;
  selectedAgent: string;
  onSelectAgent: (id: string) => void;
}

export default function AgentSideMenu({ agents, selectedAgent, onSelectAgent }: AgentSideMenuProps) {
  return (
    <StyledList>
      {agents.map((agent) => (
        <ListItem key={agent.id} disablePadding>
          <ListItemButton 
            selected={selectedAgent === agent.id}
            onClick={() => onSelectAgent(agent.id)}
          >
            <ListItemText primary={model.name} />
          </ListItemButton>
        </ListItem>
      ))}
    </StyledList>
  );
}
