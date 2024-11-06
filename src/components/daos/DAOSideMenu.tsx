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
  }
}));

interface DAOSideMenuProps {
  daos: Array<{
    id: string;
    name: string;
    memberCount: number;
  }>;
  selectedDAO: string;
  onSelectDAO: (id: string) => void;
}

export default function DAOSideMenu({ daos, selectedDAO, onSelectDAO }: DAOSideMenuProps) {
  return (
    <StyledList>
      {daos.map((dao) => (
        <ListItem key={dao.id} disablePadding>
          <ListItemButton 
            selected={selectedDAO === dao.id}
            onClick={() => onSelectDAO(dao.id)}
          >
            <ListItemText 
              primary={dao.name} 
              secondary={`${dao.memberCount} members`}
            />
          </ListItemButton>
        </ListItem>
      ))}
    </StyledList>
  );
}
