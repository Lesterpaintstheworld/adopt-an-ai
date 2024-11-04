import { List, ListItem, ListItemButton, ListItemText } from '@mui/material';
import { styled } from '@mui/material/styles';

const StyledList = styled(List)(({ theme }) => ({
  width: '240px',
  height: '100%',
  backgroundColor: 'rgba(0, 0, 0, 0.6)',
  backdropFilter: 'blur(10px)',
  borderRight: '1px solid rgba(255, 255, 255, 0.1)',
}));

interface ModelSideMenuProps {
  models: Array<{
    id: string;
    name: string;
  }>;
  selectedModel: string;
  onSelectModel: (id: string) => void;
}

export default function ModelSideMenu({ models, selectedModel, onSelectModel }: ModelSideMenuProps) {
  return (
    <StyledList>
      {models.map((model) => (
        <ListItem key={model.id} disablePadding>
          <ListItemButton 
            selected={selectedModel === model.id}
            onClick={() => onSelectModel(model.id)}
          >
            <ListItemText primary={model.name} />
          </ListItemButton>
        </ListItem>
      ))}
    </StyledList>
  );
}
