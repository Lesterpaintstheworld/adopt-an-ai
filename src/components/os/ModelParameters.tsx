import { Paper, Typography, List, ListItem, ListItemText } from '@mui/material';
import { styled } from '@mui/material/styles';

const StyledPaper = styled(Paper)(({ theme }) => ({
  height: '100%',
  padding: theme.spacing(2),
  backgroundColor: 'rgba(0, 0, 0, 0.6)',
  backdropFilter: 'blur(10px)',
  border: '1px solid rgba(255, 255, 255, 0.1)',
}));

interface Parameter {
  name: string;
  value: string | number;
  description: string;
}

interface ModelParametersProps {
  parameters: Parameter[];
}

export default function ModelParameters({ parameters }: ModelParametersProps) {
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
