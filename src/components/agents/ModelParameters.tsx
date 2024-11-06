import { Paper, Typography, List, ListItem, ListItemText } from '@mui/material';
import { styled } from '@mui/material/styles';

const StyledPaper = styled(Paper)(({ theme }) => ({
  height: '100%',
  padding: theme.spacing(3),
  backgroundColor: 'rgba(0, 0, 0, 0.4)',
  backdropFilter: 'blur(20px)',
  border: '1px solid rgba(255, 255, 255, 0.1)',
  '& .MuiListItem-root': {
    borderRadius: theme.shape.borderRadius,
    marginBottom: theme.spacing(1),
    backgroundColor: 'rgba(255, 255, 255, 0.03)',
    '&:hover': {
      backgroundColor: 'rgba(255, 255, 255, 0.05)',
    }
  },
  '& .MuiListItemText-primary': {
    fontWeight: 500,
  },
  '& .MuiListItemText-secondary': {
    color: 'rgba(255, 255, 255, 0.5)',
  }
}));

interface Parameter {
  name: string;
  value: string | number;
  description: string;
}

interface AgentParametersProps {
  parameters: Parameter[];
}

export default function AgentParameters({ parameters }: AgentParametersProps) {
  return (
    <StyledPaper>
      <Typography variant="h6" gutterBottom>
        Parameters
      </Typography>
      <List>
        {parameters.map((param) => (
          <ListItem key={param.name}>
            <ListItemText 
              primary={`${param.name}: ${param.value}`}
              secondary={param.description}
            />
          </ListItem>
        ))}
      </List>
    </StyledPaper>
  );
}
