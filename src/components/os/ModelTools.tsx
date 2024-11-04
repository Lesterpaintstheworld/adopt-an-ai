import { Paper, Typography, List, ListItem, ListItemIcon, ListItemText, Tooltip } from '@mui/material';
import { styled } from '@mui/material/styles';
import BuildIcon from '@mui/icons-material/Build';

const StyledPaper = styled(Paper)(({ theme }) => ({
  height: '100%',
  padding: theme.spacing(2),
  backgroundColor: 'rgba(0, 0, 0, 0.6)',
  backdropFilter: 'blur(10px)',
  border: '1px solid rgba(255, 255, 255, 0.1)',
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
