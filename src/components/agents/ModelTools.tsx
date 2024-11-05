import { Paper, Typography, List, ListItem, ListItemIcon, ListItemText, Tooltip } from '@mui/material';
import { styled } from '@mui/material/styles';
import BuildIcon from '@mui/icons-material/Build';

const StyledPaper = styled(Paper)(({ theme }) => ({
  height: '100%',
  padding: theme.spacing(3),
  backgroundColor: 'rgba(0, 0, 0, 0.4)',
  backdropFilter: 'blur(20px)',
  border: '1px solid rgba(255, 255, 255, 0.1)',
  transition: 'all 0.3s ease',
  '&:hover': {
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    transform: 'translateY(-2px)',
  },
  '& .MuiTypography-h6': {
    marginBottom: theme.spacing(2),
    fontSize: '1.2rem',
    fontWeight: 600,
  },
  '& .MuiListItem-root': {
    padding: theme.spacing(1.5),
    borderRadius: theme.shape.borderRadius,
    '&:hover': {
      backgroundColor: 'rgba(255, 255, 255, 0.05)',
    }
  }
}));

interface Tool {
  id: string;
  name: string;
  description: string;
}

interface ModelToolsProps {
  tools: Tool[];
}

export default function ModelTools({ tools }: ModelToolsProps) {
  return (
    <StyledPaper>
      <Typography variant="h6" gutterBottom>
        Tools
      </Typography>
      <List>
        {tools.map((tool) => (
          <Tooltip key={tool.id} title={tool.description}>
            <ListItem>
              <ListItemIcon>
                <BuildIcon />
              </ListItemIcon>
              <ListItemText primary={tool.name} />
            </ListItem>
          </Tooltip>
        ))}
      </List>
    </StyledPaper>
  );
}
